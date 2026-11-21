import { NextResponse } from "next/server";

const DEPT_CONTACTS: Record<string, string> = {
  "Water Supply & Sewerage Board": "1916 (TWAD / Metro Water Emergency)",
  "Electrical & Streetlighting Dept": "1912 (TANGEDCO / Streetlight Helpline)",
  "Public Works Department (PWD)": "1800-425-1553 (PWD Road Control Room)",
  "Solid Waste Management Dept": "1800-425-7012 (Sanitation & Waste Control)",
  "Traffic & Transport Authority": "103 (Traffic Control Room)",
  "Municipal General Administration": "1800-425-4355 (24x7 Civic Helpline)",
};

function getContactForDepartment(dept: string): string {
  const lower = dept.toLowerCase();
  if (
    lower.includes("water") ||
    lower.includes("sewerage") ||
    lower.includes("drain") ||
    lower.includes("twad") ||
    lower.includes("pipe")
  ) {
    return DEPT_CONTACTS["Water Supply & Sewerage Board"];
  }
  if (lower.includes("electric") || lower.includes("streetlight") || lower.includes("tangedco")) {
    return DEPT_CONTACTS["Electrical & Streetlighting Dept"];
  }
  if (lower.includes("public works") || lower.includes("pwd")) {
    return DEPT_CONTACTS["Public Works Department (PWD)"];
  }
  if (lower.includes("waste") || lower.includes("sanitation") || lower.includes("garbage")) {
    return DEPT_CONTACTS["Solid Waste Management Dept"];
  }
  if (lower.includes("traffic") || lower.includes("transport")) {
    return DEPT_CONTACTS["Traffic & Transport Authority"];
  }
  return DEPT_CONTACTS["Municipal General Administration"];
}

function inferPriority(text: string, defaultPriority: "Low" | "Medium" | "High" | "Critical") {
  if (
    text.includes("flood") ||
    text.includes("burst") ||
    text.includes("spark") ||
    text.includes("live wire") ||
    text.includes("accident") ||
    text.includes("collapse") ||
    text.includes("emergency") ||
    text.includes("critical")
  ) {
    return "Critical";
  }
  if (
    text.includes("minor") ||
    text.includes("faded") ||
    text.includes("paint") ||
    text.includes("sign") ||
    text.includes("cosmetic") ||
    text.includes("trim") ||
    text.includes("low priority") ||
    text.includes("small")
  ) {
    return "Low";
  }
  if (
    text.includes("moderate") ||
    text.includes("sometimes") ||
    text.includes("occasional") ||
    text.includes("bin") ||
    text.includes("slow") ||
    text.includes("medium")
  ) {
    return "Medium";
  }
  return defaultPriority;
}

function fallbackClassify(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  // 1. Water & Drainage FIRST (even if "street" or "road" is in the address)
  if (
    text.includes("water") ||
    text.includes("pipe") ||
    text.includes("leak") ||
    text.includes("drain") ||
    text.includes("sewage") ||
    text.includes("flood") ||
    text.includes("burst")
  ) {
    const department = "Water Supply & Sewerage Board";
    return {
      category: "Water & Drainage",
      priority: inferPriority(text, "Critical"),
      department,
      contactNumber: getContactForDepartment(department),
    };
  }

  // 2. Streetlights & Electrical
  if (
    text.includes("light") ||
    text.includes("electric") ||
    text.includes("wire") ||
    text.includes("pole") ||
    text.includes("power") ||
    text.includes("dark")
  ) {
    const department = "Electrical & Streetlighting Dept";
    return {
      category: "Streetlights & Electrical",
      priority: inferPriority(text, "High"),
      department,
      contactNumber: getContactForDepartment(department),
    };
  }

  // 3. Sanitation & Waste
  if (
    text.includes("garbage") ||
    text.includes("waste") ||
    text.includes("trash") ||
    text.includes("dump") ||
    text.includes("bin") ||
    text.includes("sanitation")
  ) {
    const department = "Solid Waste Management Dept";
    return {
      category: "Sanitation & Waste",
      priority: inferPriority(text, "Medium"),
      department,
      contactNumber: getContactForDepartment(department),
    };
  }

  // 4. Roads & Infrastructure
  if (
    text.includes("pothole") ||
    text.includes("road") ||
    text.includes("bridge") ||
    text.includes("footpath") ||
    text.includes("traffic")
  ) {
    const department = "Public Works Department (PWD)";
    return {
      category: "Roads & Infrastructure",
      priority: inferPriority(text, "High"),
      department,
      contactNumber: getContactForDepartment(department),
    };
  }

  const department = "Municipal General Administration";
  return {
    category: "Civic Maintenance",
    priority: inferPriority(text, "Low"),
    department,
    contactNumber: getContactForDepartment(department),
  };
}

export async function POST(req: Request) {
  let title = "";
  let description = "";
  let location = "";

  try {
    const body = await req.json();
    title = body.title || "";
    description = body.description || "";
    location = body.location || "";

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(fallbackClassify(title, description));
    }

    const prompt = `You are a municipal civic issue triage AI. Follow these strict routing rules:
- Water pipe bursts, water leaks, drainage/sewage overflow, or street flooding -> department MUST be "Water Supply & Sewerage Board", category "Water & Drainage", priority "Critical" (unless clearly minor).
- Streetlights, power cuts, electrical poles/wires -> department "Electrical & Streetlighting Dept", category "Streetlights & Electrical".
- Garbage, trash, overflowing bins, sanitation -> department "Solid Waste Management Dept", category "Sanitation & Waste".
- Potholes, road damage, footpaths (when NOT a water pipe burst/flood) -> department "Public Works Department (PWD)", category "Roads & Infrastructure".

Also vary priority across "Low", "Medium", "High", "Critical" based on actual urgency.

Title: ${title}
Description: ${description}
Location: ${location}

Respond ONLY with valid JSON:
{"category":"...","priority":"Low | Medium | High | Critical","department":"..."}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json(fallbackClassify(title, description));
    }

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(raw);

    const validPriorities = ["Low", "Medium", "High", "Critical"];
    const chosenPriority = validPriorities.includes(parsed.priority)
      ? parsed.priority
      : fallbackClassify(title, description).priority;

    if (!parsed.department || !parsed.category) {
      return NextResponse.json(fallbackClassify(title, description));
    }

    return NextResponse.json({
      category: parsed.category,
      priority: chosenPriority,
      department: parsed.department,
      contactNumber: getContactForDepartment(parsed.department),
    });
  } catch {
    return NextResponse.json(fallbackClassify(title, description));
  }
}