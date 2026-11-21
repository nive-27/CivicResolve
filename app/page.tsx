export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3F3F3] border border-zinc-900 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B9FF66] border border-zinc-900" />
            Powered by Google Gemini 2.5 Flash &amp; Firebase
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-zinc-900">
            Navigating civic issues for a{" "}
            <span className="bg-[#B9FF66] px-2 rounded-lg border-2 border-zinc-900 inline-block">
              faster city
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-700 max-w-xl leading-relaxed">
            Citizens report potholes, broken streetlights, or waste in seconds.
            Our AI engine classifies urgency, maps exact locations, and routes
            tickets straight to municipal departments.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="/report"
              className="px-7 py-4 rounded-2xl bg-[#191A23] text-white font-semibold text-base hover:bg-zinc-800 shadow-[4px_4px_0px_#B9FF66] border-2 border-zinc-900 transition"
            >
              Report an Issue →
            </a>
            <a
              href="/dashboard"
              className="px-7 py-4 rounded-2xl bg-white text-zinc-900 font-semibold text-base border-2 border-zinc-900 shadow-[4px_4px_0px_#18181B] hover:bg-[#B9FF66] transition"
            >
              Live Citizen Feed
            </a>
          </div>
        </div>

        {/* Right Graphic / Live Triage Card */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl bg-[#F3F3F3] border-2 border-zinc-900 shadow-[6px_6px_0px_#18181B] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-[#B9FF66] border border-zinc-900 text-xs font-extrabold">
                AI TRIAGE ENGINE
              </span>
              <span className="text-xs font-bold text-zinc-500">LIVE SYNC</span>
            </div>

            <div className="bg-white rounded-2xl border-2 border-zinc-900 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-500">DETECTED CATEGORY</span>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 border border-zinc-900">
                  HIGH PRIORITY
                </span>
              </div>
              <p className="font-bold text-base">
                Waterlogged Pothole at Main Junction
              </p>
              <p className="text-xs text-zinc-600">
                Routed to: <strong>Public Works Dept (PWD)</strong> • 📞 1800-425-1553
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#191A23] text-white rounded-xl p-3 border border-zinc-900">
                <div className="text-lg font-extrabold text-[#B9FF66]">&lt; 2s</div>
                <div className="text-[11px] text-zinc-300">AI Routing</div>
              </div>
              <div className="bg-white rounded-xl p-3 border-2 border-zinc-900">
                <div className="text-lg font-extrabold">6 Depts</div>
                <div className="text-[11px] text-zinc-600">Direct Helplines</div>
              </div>
              <div className="bg-[#B9FF66] rounded-xl p-3 border-2 border-zinc-900">
                <div className="text-lg font-extrabold">Maps</div>
                <div className="text-[11px] text-zinc-900">Pinpointed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services / Departments Section (Positivus 2x2 Card Grid) */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold bg-[#B9FF66] px-3 py-1 rounded-lg border-2 border-zinc-900">
            Departments
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 max-w-xl">
            Every citizen complaint is automatically classified and dispatched to
            the exact municipal division with one-tap escalation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Light Gray */}
          <div className="rounded-3xl bg-[#F3F3F3] border-2 border-zinc-900 shadow-[5px_5px_0px_#18181B] p-7 flex flex-col justify-between gap-6">
            <div>
              <span className="inline-block text-xl font-extrabold bg-[#B9FF66] px-2.5 py-0.5 rounded-md border border-zinc-900">
                Roads &amp; Infrastructure
              </span>
              <p className="text-sm text-zinc-700 mt-3">
                Potholes, damaged footpaths, and road cave-ins routed straight to
                Public Works (PWD).
              </p>
            </div>
            <a href="/report" className="inline-flex items-center gap-2 font-bold text-sm">
              <span className="w-8 h-8 rounded-full bg-[#191A23] text-[#B9FF66] flex items-center justify-center">
                ↗
              </span>
              Report Road Issue
            </a>
          </div>

          {/* Card 2: Lime Green */}
          <div className="rounded-3xl bg-[#B9FF66] border-2 border-zinc-900 shadow-[5px_5px_0px_#18181B] p-7 flex flex-col justify-between gap-6">
            <div>
              <span className="inline-block text-xl font-extrabold bg-white px-2.5 py-0.5 rounded-md border border-zinc-900">
                Streetlights &amp; Power
              </span>
              <p className="text-sm text-zinc-900 mt-3">
                Dark streets, flickering poles, and exposed wiring flagged for
                urgent Electrical Dept response.
              </p>
            </div>
            <a href="/report" className="inline-flex items-center gap-2 font-bold text-sm">
              <span className="w-8 h-8 rounded-full bg-[#191A23] text-[#B9FF66] flex items-center justify-center">
                ↗
              </span>
              Report Outage
            </a>
          </div>

          {/* Card 3: Dark Charcoal */}
          <div className="rounded-3xl bg-[#191A23] text-white border-2 border-zinc-900 shadow-[5px_5px_0px_#18181B] p-7 flex flex-col justify-between gap-6">
            <div>
              <span className="inline-block text-xl font-extrabold bg-white text-zinc-900 px-2.5 py-0.5 rounded-md">
                Water &amp; Drainage
              </span>
              <p className="text-sm text-zinc-300 mt-3">
                Burst pipelines, sewage overflow, and waterlogging escalated to
                Water Supply &amp; Sewerage Board.
              </p>
            </div>
            <a href="/report" className="inline-flex items-center gap-2 font-bold text-sm text-white">
              <span className="w-8 h-8 rounded-full bg-[#B9FF66] text-zinc-900 flex items-center justify-center">
                ↗
              </span>
              Report Water Issue
            </a>
          </div>

          {/* Card 4: Light Gray */}
          <div className="rounded-3xl bg-[#F3F3F3] border-2 border-zinc-900 shadow-[5px_5px_0px_#18181B] p-7 flex flex-col justify-between gap-6">
            <div>
              <span className="inline-block text-xl font-extrabold bg-[#B9FF66] px-2.5 py-0.5 rounded-md border border-zinc-900">
                Sanitation &amp; Waste
              </span>
              <p className="text-sm text-zinc-700 mt-3">
                Uncollected garbage dumps and overflowing bins dispatched to Solid
                Waste Management.
              </p>
            </div>
            <a href="/report" className="inline-flex items-center gap-2 font-bold text-sm">
              <span className="w-8 h-8 rounded-full bg-[#191A23] text-[#B9FF66] flex items-center justify-center">
                ↗
              </span>
              Report Sanitation Issue
            </a>
          </div>
        </div>
      </section>

      {/* Working Process Section (Positivus Stacked Banners) */}
      <section className="max-w-6xl mx-auto px-6 pt-6 pb-20">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold bg-[#B9FF66] px-3 py-1 rounded-lg border-2 border-zinc-900">
            Our Working Process
          </h2>
          <p className="text-sm sm:text-base text-zinc-600">
            Step-by-step resolution from citizen photo to verified closure.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-[#B9FF66] border-2 border-zinc-900 shadow-[5px_5px_0px_#18181B] p-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black">01</span>
              <h3 className="text-lg sm:text-xl font-extrabold">
                Citizen Submits Issue &amp; Location
              </h3>
            </div>
            <p className="text-sm text-zinc-900 mt-3 pt-3 border-t border-zinc-900">
              Log the issue title, description, and street address in seconds—no
              complicated government forms required.
            </p>
          </div>

          <div className="rounded-3xl bg-[#F3F3F3] border-2 border-zinc-900 shadow-[5px_5px_0px_#18181B] p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black">02</span>
              <h3 className="text-lg sm:text-xl font-extrabold">
                Gemini AI Assigns Priority &amp; Department Helpline
              </h3>
            </div>
            <a href="/dashboard" className="text-sm font-bold underline">
              View Feed →
            </a>
          </div>

          <div className="rounded-3xl bg-[#F3F3F3] border-2 border-zinc-900 shadow-[5px_5px_0px_#18181B] p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black">03</span>
              <h3 className="text-lg sm:text-xl font-extrabold">
                Admin Verifies on Map &amp; Marks Resolved
              </h3>
            </div>
            <a href="/admin" className="text-sm font-bold underline">
              Open Admin →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}