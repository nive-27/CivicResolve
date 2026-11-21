import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CivicResolve | AI Civic Issue Resolution",
  description: "Report city issues in seconds. Powered by Gemini 2.5 Flash & Firebase.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 antialiased selection:bg-[#B9FF66] selection:text-zinc-900">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b-2 border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-lg bg-[#B9FF66] border-2 border-zinc-900 shadow-[2px_2px_0px_#18181B] flex items-center justify-center font-black text-sm">
                CR
              </span>
              <span className="text-xl font-extrabold tracking-tight text-zinc-900">
                CivicResolve
              </span>
            </a>

            <nav className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm font-semibold">
              <a
                href="/report"
                className="px-3 py-1.5 rounded-lg hover:bg-[#B9FF66] transition"
              >
                Report Issue
              </a>
              <a
                href="/dashboard"
                className="px-3 py-1.5 rounded-lg hover:bg-[#B9FF66] transition"
              >
                Citizen Feed
              </a>
              <a
                href="/admin"
                className="px-4 py-2 rounded-xl border-2 border-zinc-900 bg-white hover:bg-[#B9FF66] shadow-[3px_3px_0px_#18181B] active:translate-x-[1px] active:translate-y-[1px] transition"
              >
                Admin Portal
              </a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}