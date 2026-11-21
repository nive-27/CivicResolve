"use client";

import { useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const SAMPLES = [
  {
    label: "1. Waterlogged Pothole (High)",
    title: "Deep crater pothole near MG Road junction",
    description:
      "Large waterlogged pothole spanning half the left lane near the bus stop. Two-wheelers are swerving into oncoming traffic.",
    location: "MG Road & 4th Cross Junction, Ward 12",
  },
  {
    label: "2. Burst Water Main (Critical)",
    title: "Burst underground water pipe flooding main street",
    description:
      "Major water main burst causing heavy street flooding and traffic disruption near the hospital entrance.",
    location: "Avinashi Road, Near KMCH Hospital, Coimbatore",
  },
  {
    label: "3. Overflowing Bin (Medium)",
    title: "Single garbage bin overflowing on 2nd Cross Street",
    description:
      "Public waste bin has not been cleared for two days and moderate trash is spilling onto the sidewalk.",
    location: "2nd Cross Street, RS Puram",
  },
  {
    label: "4. Faded Crosswalk Paint (Low)",
    title: "Faded pedestrian zebra crossing paint near park gate",
    description:
      "Minor cosmetic wear on the pedestrian crosswalk markings; needs routine repainting.",
    location: "VOC Park North Gate, Coimbatore",
  },
];

function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 600;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.65));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ReportIssuePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const fillSample = (s: (typeof SAMPLES)[number]) => {
    setTitle(s.title);
    setDescription(s.description);
    setLocation(s.location);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageToDataUrl(file);
      setImageUrl(compressed);
      setStatusMsg(`Attached "${file.name}" ready for upload.`);
    } catch {
      setStatusMsg("Could not read image file—try pasting an image URL instead.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) return;

    setSubmitting(true);
    setStatusMsg("Running Gemini AI triage & routing...");

    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, location }),
      });
      const triage = await res.json();

      await addDoc(collection(db, "issues"), {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        imageUrl: imageUrl.trim() || null,
        category: triage.category || "Civic Maintenance",
        priority: triage.priority || "Medium",
        department: triage.department || "Municipal General Administration",
        contactNumber: triage.contactNumber || "1800-425-4355 (24x7 Civic Helpline)",
        status: "Open",
        createdAt: serverTimestamp(),
      });

      setStatusMsg(
        `Routed to ${triage.department} (${triage.priority} Priority)! Redirecting to feed...`
      );
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 900);
    } catch (err: any) {
      setStatusMsg(`Error: ${err?.message || "Could not submit report."}`);
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 py-10 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 rounded-lg bg-[#B9FF66] border-2 border-zinc-900 text-xs font-extrabold uppercase tracking-wider">
            AI Triage Submission
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Report a Civic Issue
          </h1>
          <p className="text-sm sm:text-base text-zinc-600">
            Describe the problem below. Gemini 2.5 Flash automatically determines
            priority tier, assigns the municipal department, and attaches the
            emergency helpline.
          </p>
        </div>

        <div className="rounded-3xl bg-[#F3F3F3] border-2 border-zinc-900 shadow-[5px_5px_0px_#18181B] p-5 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-zinc-700">
            ⚡ Quick-Fill Demo Scenarios (Test All Priority Tiers)
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => fillSample(s)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#B9FF66] border-2 border-zinc-900 text-xs font-bold shadow-[2px_2px_0px_#18181B] transition"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white border-2 border-zinc-900 shadow-[6px_6px_0px_#18181B] p-6 sm:p-8 space-y-5"
        >
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Broken streetlight on 5th Avenue"
              className="w-full px-4 py-3 rounded-xl bg-[#F3F3F3] border-2 border-zinc-900 text-sm font-medium focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2">
              Location / Landmark *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Avinashi Road, Neelambur, Coimbatore"
              className="w-full px-4 py-3 rounded-xl bg-[#F3F3F3] border-2 border-zinc-900 text-sm font-medium focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the severity, safety hazards, or how long it has been unaddressed..."
              className="w-full px-4 py-3 rounded-xl bg-[#F3F3F3] border-2 border-zinc-900 text-sm font-medium focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider">
              Photo Evidence (Upload File or Paste Image URL — Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs font-semibold text-zinc-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-2 file:border-zinc-900 file:text-xs file:font-extrabold file:bg-[#B9FF66] file:text-zinc-900 hover:file:brightness-95"
            />
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... (or auto-filled when you pick a photo)"
              className="w-full px-4 py-3 rounded-xl bg-[#F3F3F3] border-2 border-zinc-900 text-sm font-medium focus:bg-white focus:outline-none"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-2 w-40 h-28 object-cover rounded-xl border-2 border-zinc-900"
              />
            )}
          </div>

          {statusMsg && (
            <div className="p-3.5 rounded-xl bg-[#B9FF66] border-2 border-zinc-900 text-xs font-extrabold">
              {statusMsg}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3.5 rounded-2xl bg-[#191A23] text-white font-bold text-sm sm:text-base border-2 border-zinc-900 shadow-[4px_4px_0px_#B9FF66] hover:bg-zinc-800 disabled:opacity-50 transition"
            >
              {submitting ? "Classifying & Dispatching..." : "Submit Issue Report →"}
            </button>
            <a
              href="/dashboard"
              className="px-5 py-3.5 rounded-2xl bg-white text-zinc-900 font-bold text-sm border-2 border-zinc-900 hover:bg-[#F3F3F3] transition"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}