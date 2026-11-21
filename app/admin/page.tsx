"use client";

import { useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

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

const ADMIN_PASSCODE = "admin123";

interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  priority: string;
  department: string;
  contactNumber?: string;
  status: string;
}

function getDeptContact(dept = "", existing?: string) {
  if (existing) return existing;
  const d = dept.toLowerCase();
  if (d.includes("water") || d.includes("sewerage") || d.includes("drain")) return "1916 (TWAD / Metro Water Emergency)";
  if (d.includes("electric") || d.includes("streetlight")) return "1912 (TANGEDCO / Streetlight Helpline)";
  if (d.includes("public works") || d.includes("pwd") || d.includes("road")) return "1800-425-1553 (PWD Road Control Room)";
  if (d.includes("waste") || d.includes("sanitation") || d.includes("garbage")) return "1800-425-7012 (Sanitation & Waste Control)";
  if (d.includes("traffic")) return "103 (Traffic Control Room)";
  return "1800-425-4355 (24x7 Civic Helpline)";
}

export default function AdminPortalPage() {
  const [authorized, setAuthorized] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openMapId, setOpenMapId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("civic_admin_auth") === "true") {
      setAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (!authorized) return;
    async function loadIssues() {
      const snap = await getDocs(collection(db, "issues"));
      setIssues(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Issue, "id">),
        }))
      );
    }
    loadIssues();
  }, [authorized]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PASSCODE) {
      sessionStorage.setItem("civic_admin_auth", "true");
      setAuthorized(true);
      setPinError("");
    } else {
      setPinError("Invalid municipal passcode. Try admin123");
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem("civic_admin_auth");
    setAuthorized(false);
    setPinInput("");
  };

  const changeStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "issues", id), { status: newStatus });
      setIssues((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const removeIssue = async (id: string) => {
    setUpdatingId(id);
    try {
      await deleteDoc(doc(db, "issues", id));
      setIssues((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setUpdatingId(null);
    }
  };

  if (!authorized) {
    return (
      <main className="min-h-[85vh] bg-white text-zinc-900 flex items-center justify-center px-6">
        <form
          onSubmit={handleUnlock}
          className="w-full max-w-md rounded-3xl bg-[#F3F3F3] border-2 border-zinc-900 shadow-[6px_6px_0px_#18181B] p-8 space-y-5"
        >
          <span className="inline-block px-3 py-1 rounded-lg bg-[#191A23] text-[#B9FF66] text-xs font-extrabold uppercase tracking-wider">
            Restricted Access
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Municipal Admin Login
          </h1>
          <p className="text-sm text-zinc-600">
            Enter the department officer passcode to manage issue statuses,
            dispatch helplines, and moderate reports.
          </p>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2">
              Officer Passcode
            </label>
            <input
              type="password"
              required
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter passcode (Demo: admin123)"
              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-zinc-900 text-sm font-bold focus:outline-none"
            />
          </div>

          {pinError && (
            <p className="text-xs font-extrabold text-red-600">{pinError}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#191A23] text-white font-bold text-sm border-2 border-zinc-900 shadow-[4px_4px_0px_#B9FF66] hover:bg-zinc-800 transition"
          >
            Unlock Command Center →
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded bg-[#191A23] text-[#B9FF66] text-xs font-extrabold uppercase tracking-wider">
              Municipal Operations Control
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Admin Resolution Portal
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-white border-2 border-zinc-900 text-zinc-900 text-sm font-bold shadow-[3px_3px_0px_#18181B] hover:bg-[#B9FF66] transition"
            >
              Citizen Feed
            </a>
            <button
              type="button"
              onClick={handleLock}
              className="px-5 py-2.5 rounded-xl bg-[#191A23] text-[#B9FF66] text-sm font-bold border-2 border-zinc-900 hover:bg-zinc-800 transition"
            >
              🔒 Lock Portal
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl bg-[#F3F3F3] border-2 border-zinc-900 shadow-[4px_4px_0px_#18181B] p-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-600">
              Total Reports
            </p>
            <p className="text-3xl font-black text-zinc-900 mt-1">{issues.length}</p>
          </div>
          <div className="rounded-3xl bg-[#191A23] text-white border-2 border-zinc-900 shadow-[4px_4px_0px_#18181B] p-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-300">
              Active / Open
            </p>
            <p className="text-3xl font-black text-[#B9FF66] mt-1">
              {issues.filter((i) => i.status !== "Resolved").length}
            </p>
          </div>
          <div className="rounded-3xl bg-[#B9FF66] border-2 border-zinc-900 shadow-[4px_4px_0px_#18181B] p-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-900">
              Resolved
            </p>
            <p className="text-3xl font-black text-zinc-900 mt-1">
              {issues.filter((i) => i.status === "Resolved").length}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {issues.map((issue) => {
            const contact = getDeptContact(issue.department, issue.contactNumber);
            const dialNumber = contact.split(" ")[0];
            const encodedLoc = encodeURIComponent(issue.location || "India");
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLoc}`;
            const embedUrl = `https://www.google.com/maps?q=${encodedLoc}&output=embed`;
            const isMapOpen = openMapId === issue.id;

            return (
              <div
                key={issue.id}
                className="rounded-3xl bg-[#F3F3F3] border-2 border-zinc-900 shadow-[5px_5px_0px_#18181B] p-6 space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-[#191A23] text-white">
                        {issue.department}
                      </span>
                      <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-white text-zinc-900 border-2 border-zinc-900">
                        {issue.priority} Priority
                      </span>
                      <a
                        href={`tel:${dialNumber}`}
                        className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-[#B9FF66] text-zinc-900 border-2 border-zinc-900 hover:brightness-95 transition"
                      >
                        📞 Dispatch: {contact}
                      </a>
                      <span className="text-xs font-semibold text-zinc-600">
                        • 📍 {issue.location}
                      </span>
                    </div>
                    <h2 className="text-lg font-extrabold text-zinc-900">
                      {issue.title}
                    </h2>
                    <p className="text-sm text-zinc-700">{issue.description}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setOpenMapId(isMapOpen ? null : issue.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#191A23] text-white border-2 border-zinc-900 text-xs font-bold hover:bg-zinc-800 transition"
                      >
                        🗺️ {isMapOpen ? "Hide Map" : "Preview Map"}
                      </button>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white text-zinc-900 border-2 border-zinc-900 text-xs font-bold hover:bg-[#B9FF66] transition"
                      >
                        ↗ Google Maps
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {(["Open", "In Progress", "Resolved"] as const).map((st) => (
                      <button
                        key={st}
                        disabled={updatingId === issue.id}
                        onClick={() => changeStatus(issue.id, st)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border-2 border-zinc-900 transition ${
                          issue.status === st
                            ? "bg-[#B9FF66] text-zinc-900 shadow-[2px_2px_0px_#18181B]"
                            : "bg-white text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                    <button
                      disabled={updatingId === issue.id}
                      onClick={() => removeIssue(issue.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-extrabold border-2 border-zinc-900 bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isMapOpen && (
                  <div className="rounded-2xl overflow-hidden border-2 border-zinc-900 bg-white">
                    <iframe
                      title={`Map for ${issue.location}`}
                      src={embedUrl}
                      className="w-full h-56 border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}