import React from "react";
import { ShieldAlert, Heart, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Urgent Emergency Warning Banner */}
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-900">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs">
            <span className="font-bold">Life-Threatening Emergency Notice:</span>{" "}
            CivicResolve is designed for non-emergency municipal issues. For active gas leaks, fires, downed live power lines, medical crises, or violent emergencies, dial{" "}
            <span className="font-bold underline">911</span> or your national emergency response number immediately.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div>
            <span className="font-semibold text-slate-800">CivicResolve</span> — AI-Powered Civic Issue Reporting & Resolution Platform.
            <div className="text-slate-500 text-[11px] mt-0.5">
              Built with Next.js, Google Gemini Flash, Firebase, and Tailwind CSS. Complies with WCAG 2.1 AA accessibility guidelines.
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <span className="inline-flex items-center gap-1">
              Google Cloud & Gemini
            </span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
