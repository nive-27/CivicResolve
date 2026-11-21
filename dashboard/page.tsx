"use client";

import { useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";

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
  status: string;
  imageUrl?: string | null;
}

export default function CitizenDashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Issue, "id">),
        }));
        setIssues(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  const badgeColor = (status: string) => {
    if (status === "Resolved") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (status === "In Progress") return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Citizen Dashboard</h1>
            <p className="text-sm text-slate-500">
              Live tracking of reported civic issues and AI department routing.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/report"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
            >
              + Report New Issue
            </a>
            <a
              href="/admin"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition"
            >
              Admin Portal →
            </a>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading reports from Firestore...</p>
        ) : issues.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-600 mb-4">No civic issues reported yet.</p>
            <a href="/report" className="text-blue-600 font-semibold text-sm hover:underline">
              Submit your first report →
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeColor(issue.status)}`}>
                      {issue.status || "Open"}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {issue.category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      Priority: {issue.priority}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{issue.title}</h2>
                  <p className="text-sm text-slate-600">{issue.description}</p>
                  <p className="text-xs text-slate-500">
                    📍 <strong>{issue.location}</strong> • Routed to: <strong>{issue.department}</strong>
                  </p>
                </div>
                {issue.imageUrl && (
                  <img
                    src={issue.imageUrl}
                    alt={issue.title}
                    className="w-full md:w-36 h-28 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}