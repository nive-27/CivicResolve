import {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
  Department,
} from "@/types/complaint";

export const CATEGORIES: ComplaintCategory[] = [
  "Pothole/Road",
  "Garbage/Sanitation",
  "Streetlight/Electrical",
  "Water/Drainage",
  "Other",
];

export const PRIORITIES: ComplaintPriority[] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

export const STATUSES: ComplaintStatus[] = [
  "Reported",
  "In Progress",
  "Resolved",
];

export const DEPARTMENTS: Department[] = [
  "Public Works",
  "Sanitation",
  "Electricity Board",
  "Water Board",
  "General Administration",
];

/**
 * Maps a complaint category to the responsible government department.
 */
export function getDepartmentForCategory(category: ComplaintCategory): Department {
  switch (category) {
    case "Pothole/Road":
      return "Public Works";
    case "Garbage/Sanitation":
      return "Sanitation";
    case "Streetlight/Electrical":
      return "Electricity Board";
    case "Water/Drainage":
      return "Water Board";
    case "Other":
    default:
      return "General Administration";
  }
}

/**
 * Priority scoring heuristic helper for fallback logic or verification.
 * Safety risk and public impact determine priority.
 */
export function calculateFallbackPriority(text: string): ComplaintPriority {
  const normalized = text.toLowerCase();
  
  // Critical indicators: danger to life, sparking, cave-in, deep trench, gas leak, high risk
  if (
    normalized.includes("danger") ||
    normalized.includes("emergency") ||
    normalized.includes("spark") ||
    normalized.includes("fire") ||
    normalized.includes("electrocution") ||
    normalized.includes("cave-in") ||
    normalized.includes("deep hole") ||
    normalized.includes("collapsed") ||
    normalized.includes("hazard") ||
    normalized.includes("major flood")
  ) {
    return "Critical";
  }

  // High indicators: blocked main road, open drain, overflowing sewage, main water pipe burst
  if (
    normalized.includes("blocked") ||
    normalized.includes("overflow") ||
    normalized.includes("burst") ||
    normalized.includes("sewage") ||
    normalized.includes("broken pipe") ||
    normalized.includes("busy road") ||
    normalized.includes("highway") ||
    normalized.includes("accident")
  ) {
    return "High";
  }

  // Low indicators: minor cosmetic, graffiti, small litter, non-urgent
  if (
    normalized.includes("minor") ||
    normalized.includes("small") ||
    normalized.includes("cosmetic") ||
    normalized.includes("graffiti") ||
    normalized.includes("faint") ||
    normalized.includes("slow")
  ) {
    return "Low";
  }

  // Default medium
  return "Medium";
}

export const PRIORITY_STYLES: Record<
  ComplaintPriority,
  { bg: string; text: string; border: string; dot: string; label: string }
> = {
  Low: {
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    text: "text-emerald-800",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    label: "Low Priority",
  },
  Medium: {
    bg: "bg-amber-50 text-amber-900 border-amber-300",
    text: "text-amber-900",
    border: "border-amber-300",
    dot: "bg-amber-500",
    label: "Medium Priority",
  },
  High: {
    bg: "bg-orange-50 text-orange-900 border-orange-300",
    text: "text-orange-900",
    border: "border-orange-300",
    dot: "bg-orange-500",
    label: "High Priority",
  },
  Critical: {
    bg: "bg-red-50 text-red-900 border-red-300",
    text: "text-red-900",
    border: "border-red-300",
    dot: "bg-red-600 animate-pulse",
    label: "Critical Priority",
  },
};

export const STATUS_STYLES: Record<
  ComplaintStatus,
  { bg: string; text: string; border: string; label: string }
> = {
  Reported: {
    bg: "bg-blue-50 text-blue-800 border-blue-200",
    text: "text-blue-800",
    border: "border-blue-200",
    label: "Reported",
  },
  "In Progress": {
    bg: "bg-amber-50 text-amber-900 border-amber-300",
    text: "text-amber-900",
    border: "border-amber-300",
    label: "In Progress",
  },
  Resolved: {
    bg: "bg-emerald-50 text-emerald-900 border-emerald-300",
    text: "text-emerald-900",
    border: "border-emerald-300",
    label: "Resolved",
  },
};
