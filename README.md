## \# CivicResolve — AI-Driven Municipal Issue Triage, Geolocation \& Resolution Platform

###### 

###### > \*\*Autonomous Civic-Tech Workflow:\*\* Connecting citizens directly to municipal response teams through real-time \*\*Google Gemini 2.5 Flash\*\* triage, deterministic fallback routing, interactive geolocation, and closed-loop administrative resolution.

###### 

###### \- \*\*Live Production Deployment:\*\* `https://civic-resolve-lemon-one.vercel.app/`

###### \- \*\*Source Repository:\*\* `https://github.com/nive-27/CivicResolve`

###### \- \*\*Admin Command Center Passcode:\*\* `admin123` \*(built-in demo credential for evaluators)\*

###### 

###### \---

###### 
<img width="1857" height="957" alt="image" src="https://github.com/user-attachments/assets/ce6db289-9168-49c8-989e-bdf8ba4b69df" />
<img width="1847" height="907" alt="image" src="https://github.com/user-attachments/assets/90d147ff-c789-4e0e-b2ef-5b7102ec488f" />
<img width="1847" height="907" alt="image" src="https://github.com/user-attachments/assets/bb7aebd4-9ae3-4c67-92de-2c8ee7eb79c1" />
<img width="1707" height="902" alt="image" src="https://github.com/user-attachments/assets/092bfa06-79bd-4208-84d6-363cc24020db" />
<img width="1697" height="912" alt="image" src="https://github.com/user-attachments/assets/eaba7fe0-81a8-4f68-a2ee-aaf3938fee44" />





###### \## 1. Problem Statement \& Real-World Impact

###### 

###### Traditional municipal complaint portals suffer from three systemic bottlenecks:

###### 1\. \*\*Manual Triage Delays:\*\* Citizen grievances sit in uncategorized queues for days before reaching the responsible department.

###### 2\. \*\*Flat Urgency Handling:\*\* Life-safety emergencies (burst water mains, exposed live wires, flooded junctions) are mixed in with routine cosmetic maintenance (faded crosswalk paint).

###### 3\. \*\*Opaque Resolution Loops:\*\* Citizens receive no live status updates, map verification, or direct escalation contacts once a ticket is filed.

###### 

###### \*\*CivicResolve\*\* eliminates manual routing friction by turning unstructured citizen reports into prioritized, department-routed, map-verified tickets in under 2 seconds—improving civic responsiveness, public safety, and government transparency.

###### 

###### \---

###### 

###### \## 2. Core Features \& Technical Highlights

###### 

###### \### Intelligent AI Triage Engine (`/api/classify`)

###### \- \*\*Structured LLM Classification:\*\* Integrates \*\*Google Gemini 2.5 Flash\*\* (`responseMimeType: "application/json"`) to parse free-text citizen descriptions and locations into deterministic structured schemas (`category`, `priority`, `department`, `contactNumber`).

###### \- \*\*Four-Tier Severity Scoring (`Low` | `Medium` | `High` | `Critical`):\*\* Prompt-engineered with explicit municipal risk rubrics so critical hazards (flooding, pipe bursts, sparking wires) escalate immediately while routine upkeep is triaged proportionally.

###### \- \*\*Fault-Tolerant Deterministic Fallback:\*\* Includes a domain-specific keyword \& priority-inference fallback engine so the platform maintains 100% uptime and accurate routing even under API rate limits or network degradation.

###### 

###### \### Direct Departmental Routing \& One-Tap Escalation

###### \- Maps complaints across six municipal divisions (\*\*Water Supply \& Sewerage Board\*\*, \*\*Electrical \& Streetlighting Dept\*\*, \*\*Public Works Department (PWD)\*\*, \*\*Solid Waste Management Dept\*\*, \*\*Traffic \& Transport Authority\*\*, and \*\*Municipal General Administration\*\*).

###### \- Automatically attaches verified emergency control room numbers (e.g., `1916` Water Emergency, `1912` Electrical/Streetlight Helpline, `1800-425-1553` PWD Road Control) as clickable `tel:` dispatch links.

###### 

###### \### Citizen Submission Studio (`/report`)

###### \- \*\*Zero-Friction Reporting:\*\* Clean, accessible Neo-Brutalist UI designed for rapid mobile and desktop submission.

###### \- \*\*Client-Side Image Compression:\*\* Supports both direct image URLs and local file uploads with automatic HTML5 Canvas resizing/JPEG compression (`600px` max width) for fast, lightweight Firestore persistence without external storage overhead.

###### \- \*\*One-Click Evaluator Presets:\*\* Built-in demo scenarios spanning `Critical`, `High`, `Medium`, and `Low` severity tiers for instant end-to-end testing.

###### 

###### \### Real-Time Citizen Feed \& Geolocation (`/dashboard`)

###### \- \*\*Live Cloud Sync:\*\* Powered by \*\*Firebase Firestore\*\* for instant synchronization between citizen submissions and administrative updates.

###### \- \*\*Interactive Google Maps Integration:\*\* Every ticket features an inline collapsible \*\*Google Maps Embed (`<iframe>`)\*\* preview plus a one-click \*\*Open in Google Maps\*\* external navigation link—requiring zero extra billing setup.

###### 

###### \### Passcode-Gated Municipal Admin Portal (`/admin`)

###### \- \*\*Role-Based Access Control:\*\* Protected by a session-persisted officer passcode gate (`admin123`) with instant lock/unlock controls.

###### \- \*\*Live Operational Telemetry:\*\* Real-time KPI cards tracking \*\*Total Reports\*\*, \*\*Active / Open\*\* tickets, and \*\*Resolved\*\* issues.

###### \- \*\*Closed-Loop Resolution \& Moderation:\*\* Department officers can inspect map locations, dial dispatch helplines, transition tickets across `Open` → `In Progress` → `Resolved`, and remove spam/duplicate entries.

###### 

###### \---

###### 

###### \## 3. System Architecture \& Data Flow

###### 

###### ```text

###### ┌──────────────────────┐      POST /api/classify      ┌─────────────────────────────┐

###### │   Citizen Portal     │ ───────────────────────────► │   Google Gemini 2.5 Flash   │

###### │      (/report)       │                              │  (JSON Triage + Fallback)   │

###### └──────────┬───────────┘                              └──────────────┬──────────────┘

###### &#x20;          │                                                         │

###### &#x20;          │  Enriched Ticket (Category, Priority, Dept, Helpline)   │

###### &#x20;          ▼                                                         ▼

###### ┌───────────────────────────────────────────────────────────────────────────────────┐

###### │                            Firebase Cloud Firestore                               │

###### │                       (Real-Time `issues` Collection Store)                       │

###### └───────────────────┬───────────────────────────────────────────┬───────────────────┘

###### &#x20;                   │                                           │

###### &#x20;                   ▼                                           ▼

###### ┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐

###### │        Public Citizen Feed            │   │       Admin Resolution Portal         │

###### │             (/dashboard)              │   │               (/admin)                │

###### │ • Live Status \& Priority Badges       │   │ • Officer Passcode Gate (`admin123`)  │

###### │ • Inline Google Maps Embeds           │   │ • Live KPI Counters \& Status Toggles  │

###### │ • One-Tap Emergency `tel:` Dispatch   │   │ • Map Verification \& Moderation       │

###### └───────────────────────────────────────┘   └───────────────────────────────────────┘
## 🧪 Running Tests

This project uses **Vitest** and **React Testing Library** to verify civic issue classification and department-routing logic.

```bash
npm test
Test Suite: __tests__/classify.test.ts

Setup Configuration: tests/setup.ts
