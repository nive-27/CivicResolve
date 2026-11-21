export type ComplaintCategory =
  | "Pothole/Road"
  | "Garbage/Sanitation"
  | "Streetlight/Electrical"
  | "Water/Drainage"
  | "Other";

export type ComplaintPriority = "Low" | "Medium" | "High" | "Critical";

export type ComplaintStatus = "Reported" | "In Progress" | "Resolved";

export type Department =
  | "Public Works"
  | "Sanitation"
  | "Electricity Board"
  | "Water Board"
  | "General Administration";

export interface ComplaintLocation {
  address: string;
  lat?: number;
  lng?: number;
}

export interface TimelineEntry {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  note?: string;
  updatedBy: {
    uid: string;
    name: string;
    role: "citizen" | "admin";
  };
}

export interface AIAnalysis {
  category: ComplaintCategory;
  priority: ComplaintPriority;
  department: Department;
  reasoning: string;
  confidence: number;
  modelUsed?: string;
  isFallback: boolean;
  analyzedAt: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  location: ComplaintLocation;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  department: Department;
  status: ComplaintStatus;
  imageBase64?: string;
  userId: string;
  userEmail: string;
  userName: string;
  aiAnalysis: AIAnalysis;
  isManualReview: boolean;
  statusTimeline: TimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintFilters {
  status?: ComplaintStatus | "All";
  priority?: ComplaintPriority | "All";
  department?: Department | "All";
  category?: ComplaintCategory | "All";
  search?: string;
}

export interface AdminStats {
  total: number;
  byStatus: {
    reported: number;
    inProgress: number;
    resolved: number;
  };
  byPriority: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  manualReviewCount: number;
}
