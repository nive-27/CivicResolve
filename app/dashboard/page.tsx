"use client";

import { useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
  imageUrl?: string | null;
}

function getDeptContact(dept = "", existing?: string) {
  if (existing) return existing;
  const d = dept.toLowerCase();
  if (d.includes("public works") || d.includes("pwd") || d.includes("road")) return "1800-425-1553 (PWD Road Control Room)";
  if (d.includes("electric") || d.includes("streetlight")) return "1912 (TANGEDCO / Streetlight Helpline)";
  if (d.includes("waste") || d.includes("sanitation") || d.includes("garbage")) return "1800-425-7012 (Sanitation & Waste Control)";
  if (d.includes("water") || d.includes("sewerage") || d.includes("drain")) return "1916 (TWAD / Metro Water Emergency)";
  if (d.includes("traffic")) return "103 (Traffic Control Room)";
  return "1800-425-4355 (24x7 Civic Helpline)";
}

export default function CitizenDashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMapId, setOpenMapId] = useState<string | null>(null);

  useEffect(() => {
    async function loadIssues() {
      try {
        const snap = await getDocs(collection(db, "issues"));
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Issue, "id">),
        }));
        setIssues(list);
      } catch (err: any) {
        setError(err?.message || "Failed to load issues.");
      } finally {
        setLoading(false);
      }
    }
    loadIssues();
  }, []);

  const statusBadge = (status: string) => {
    if (status === "Resolved") return "bg-[#B9FF66] text-zinc-900 border-zinc-900";
    if (status === "In Progress") return "bg-amber-200 text-zinc-900 border-zinc-900";
    return "bg-white text-zinc-900 border-zinc-900";
  };

  const priorityBadge = (priority: string) => {
    if (priority === "Critical") return "bg-[#191A23] text-[#B9FF66] border-zinc-900";
    if (priority === "High") return "bg-orange-200 text-zinc-900 border-zinc-900";
    if (priority === "Medium") return "bg-yellow-100 text-zinc-900 border-zinc-900";
    return "bg-[#F3F3F3] text-zinc-800 border-zinc-900";
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span className="bg-[#B9FF66] px-2.5 py-0.5 rounded-lg border-2 border-zinc-900">
                Citizen Feed
              </span>
            </h1>
            <p className="text-sm text-zinc-600 pt-1">
              Live tracking of reported civic issues, AI priority routing, map
              pins, and direct helplines.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/report"
              className="px-5 py-2.5 rounded-xl bg-[#191A23] text-white font-bold text-sm border-2 border-zinc-900 shadow-[3px_3px_0px_#B9FF66] hover:bg-zinc-800 transition"
            >
              + Report Issue
            </a>
            <a
              href="/admin"
              className="px-5 py-2.5 rounded-xl bg-white text-zinc-900 font-bold text-sm border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] hover:bg-[#B9FF66] transition"
            >
              Admin Portal →
            </a>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-100 border-2 border-zinc-900 text-sm font-bold text-red-900">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl bg-[#F3F3F3] border-2 border-zinc-900 p-8 text-sm font-bold">
            Loading live reports from Firestore...
          </div>
        ) : issues.length === 0 ? (
          <div className="rounded-3xl bg-[#F3F3F3] border-2 border-zinc-900 shadow-[5px_5px_0px_#18181B] p-10 text-center space-y-4">
            <p className="text-base font-bold text-zinc-800">
              No civic issues reported yet.
            </p>
            <a
              href="/report"
              className="inline-block px-6 py-3 rounded-xl bg-[#B9FF66] border-2 border-zinc-900 font-extrabold text-sm shadow-[3px_3px_0px_#18181B]"
            >
              Submit your first report →
            </a>
          </div>
        ) : (
          <div className="space-y-5">
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
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs font-extrabold px-3 py-0.5 rounded-full border-2 ${statusBadge(issue.status)}`}>
                          {issue.status || "Open"}
                        </span>
                        <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-white border border-zinc-900 text-zinc-800">
                          {issue.category}
                        </span>
                        <span className={`text-xs font-extrabold px-3 py-0.5 rounded-full border-2 ${priorityBadge(issue.priority)}`}>
                          Priority: {issue.priority}
                        </span>
                      </div>

                      <h2 className="text-xl font-extrabold text-zinc-900">
                        {issue.title}
                      </h2>
                      <p className="text-sm text-zinc-700 leading-relaxed">
                        {issue.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-semibold text-zinc-800">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-zinc-900">
                          📍 {issue.location}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-zinc-900">
                          🏛️ {issue.department}
                        </span>
                        <a
                          href={`tel:${dialNumber}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#B9FF66] text-zinc-900 border-2 border-zinc-900 font-extrabold hover:brightness-95 transition"
                        >
                          📞 {contact}
                        </a>
                        <button
                          type="button"
                          onClick={() => setOpenMapId(isMapOpen ? null : issue.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#191A23] text-white border-2 border-zinc-900 font-bold hover:bg-zinc-800 transition"
                        >
                          🗺️ {isMapOpen ? "Hide Map" : "Preview Map"}
                        </button>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white text-zinc-900 border-2 border-zinc-900 font-bold hover:bg-[#B9FF66] transition"
                        >
                          ↗ Google Maps
                        </a>
                      </div>
                    </div>

                    {issue.imageUrl && (
                      <img
                        src={issue.imageUrl}
                        alt={issue.title}
                        className="w-full md:w-40 h-32 object-cover rounded-2xl border-2 border-zinc-900 shrink-0"
                      />
                    )}
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
        )}
      </div>
    </main>
  );
}