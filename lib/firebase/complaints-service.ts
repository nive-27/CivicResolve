import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  QueryConstraint,
  DocumentSnapshot,
} from "@firebase/firestore";
import { db, isFirebaseConfigured } from "./client";
import {
  Complaint,
  ComplaintFilters,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
  Department,
  AdminStats,
  TimelineEntry,
} from "@/types/complaint";
import { AppUser } from "@/types/user";
import { getDepartmentForCategory } from "@/lib/constants";

const COLLECTION_NAME = "complaints";
const STORAGE_KEY = "civicresolve_demo_complaints";

// Initial realistic demo complaints for instant testing
export const INITIAL_DEMO_COMPLAINTS: Complaint[] = [
  {
    id: "civic-1001",
    title: "Dangerous deep pothole near school crossing",
    description: "Deep pothole spanning approximately 3 feet across and 6 inches deep right in front of Oak Elementary crosswalk. Causing vehicles to swerve into oncoming traffic.",
    location: {
      address: "452 Maple Ave, Greenfield (near Oak Elementary)",
      lat: 37.7749,
      lng: -122.4194,
    },
    category: "Pothole/Road",
    priority: "High",
    department: "Public Works",
    status: "Reported",
    userId: "demo-citizen-101",
    userEmail: "citizen.jane@example.com",
    userName: "Jane Citizen",
    aiAnalysis: {
      category: "Pothole/Road",
      priority: "High",
      department: "Public Works",
      reasoning: "Deep pothole directly in a school crosswalk presents an immediate safety risk of vehicle collisions and pedestrian harm.",
      confidence: 0.94,
      modelUsed: "gemini-2.5-flash",
      isFallback: false,
      analyzedAt: "2026-11-20T14:32:00.000Z",
    },
    isManualReview: false,
    statusTimeline: [
      {
        id: "tl-1001-1",
        status: "Reported",
        timestamp: "2026-11-20T14:32:00.000Z",
        note: "Issue reported by citizen and analyzed by Gemini AI.",
        updatedBy: {
          uid: "demo-citizen-101",
          name: "Jane Citizen",
          role: "citizen",
        },
      },
    ],
    createdAt: "2026-11-20T14:32:00.000Z",
    updatedAt: "2026-11-20T14:32:00.000Z",
  },
  {
    id: "civic-1002",
    title: "Broken streetlight causing pitch black intersection",
    description: "The corner streetlight has been dead for 5 days. High pedestrian area with repeated near-miss accidents at night.",
    location: {
      address: "Corner of Elm St & 5th Ave",
      lat: 37.7758,
      lng: -122.4172,
    },
    category: "Streetlight/Electrical",
    priority: "Medium",
    department: "Electricity Board",
    status: "In Progress",
    userId: "demo-citizen-101",
    userEmail: "citizen.jane@example.com",
    userName: "Jane Citizen",
    aiAnalysis: {
      category: "Streetlight/Electrical",
      priority: "Medium",
      department: "Electricity Board",
      reasoning: "Broken luminaire in an intersection reduces night visibility, creating traffic and pedestrian hazard.",
      confidence: 0.96,
      modelUsed: "gemini-2.5-flash",
      isFallback: false,
      analyzedAt: "2026-11-19T10:15:00.000Z",
    },
    isManualReview: false,
    statusTimeline: [
      {
        id: "tl-1002-1",
        status: "Reported",
        timestamp: "2026-11-19T10:15:00.000Z",
        note: "Issue submitted and dispatched to Electricity Board queue.",
        updatedBy: {
          uid: "demo-citizen-101",
          name: "Jane Citizen",
          role: "citizen",
        },
      },
      {
        id: "tl-1002-2",
        status: "In Progress",
        timestamp: "2026-11-20T09:00:00.000Z",
        note: "Electrical crew dispatched to replace ballast and LED fixture.",
        updatedBy: {
          uid: "demo-admin-901",
          name: "Alex Rivera (Public Works Dept)",
          role: "admin",
        },
      },
    ],
    createdAt: "2026-11-19T10:15:00.000Z",
    updatedAt: "2026-11-20T09:00:00.000Z",
  },
  {
    id: "civic-1003",
    title: "Major water main line burst flooding sidewalk",
    description: "Clean drinking water gushing from underground crack under sidewalk pavement. Water stream is reaching roadway and eroding soil.",
    location: {
      address: "89 Market Boulevard",
      lat: 37.7812,
      lng: -122.4085,
    },
    category: "Water/Drainage",
    priority: "Critical",
    department: "Water Board",
    status: "In Progress",
    userId: "demo-citizen-102",
    userEmail: "carlos.m@example.org",
    userName: "Carlos Mendez",
    aiAnalysis: {
      category: "Water/Drainage",
      priority: "Critical",
      department: "Water Board",
      reasoning: "Pressurized main line burst presents imminent structural erosion, roadway flooding, and potable water loss.",
      confidence: 0.98,
      modelUsed: "gemini-2.5-flash",
      isFallback: false,
      analyzedAt: "2026-11-21T07:20:00.000Z",
    },
    isManualReview: false,
    statusTimeline: [
      {
        id: "tl-1003-1",
        status: "Reported",
        timestamp: "2026-11-21T07:20:00.000Z",
        note: "Auto-classified as Critical by Gemini. Priority notification dispatched.",
        updatedBy: {
          uid: "demo-citizen-102",
          name: "Carlos Mendez",
          role: "citizen",
        },
      },
      {
        id: "tl-1003-2",
        status: "In Progress",
        timestamp: "2026-11-21T07:45:00.000Z",
        note: "Emergency valve isolation squad on-site.",
        updatedBy: {
          uid: "demo-admin-901",
          name: "Alex Rivera",
          role: "admin",
        },
      },
    ],
    createdAt: "2026-11-21T07:20:00.000Z",
    updatedAt: "2026-11-21T07:45:00.000Z",
  },
  {
    id: "civic-1004",
    title: "Overflowing commercial garbage bins behind plaza",
    description: "Several commercial dumpsters overflowing with trash bags onto public alley. Attracting rodents and strong odor.",
    location: {
      address: "Alley behind 124 Pine Street Plaza",
      lat: 37.7915,
      lng: -122.4011,
    },
    category: "Garbage/Sanitation",
    priority: "Medium",
    department: "Sanitation",
    status: "Resolved",
    userId: "demo-citizen-101",
    userEmail: "citizen.jane@example.com",
    userName: "Jane Citizen",
    aiAnalysis: {
      category: "Garbage/Sanitation",
      priority: "Medium",
      department: "Sanitation",
      reasoning: "Accumulated biological waste in public alley poses public health risk and pest attraction.",
      confidence: 0.95,
      modelUsed: "gemini-2.5-flash",
      isFallback: false,
      analyzedAt: "2026-11-18T11:00:00.000Z",
    },
    isManualReview: false,
    statusTimeline: [
      {
        id: "tl-1004-1",
        status: "Reported",
        timestamp: "2026-11-18T11:00:00.000Z",
        note: "Reported with photo verification.",
        updatedBy: {
          uid: "demo-citizen-101",
          name: "Jane Citizen",
          role: "citizen",
        },
      },
      {
        id: "tl-1004-2",
        status: "In Progress",
        timestamp: "2026-11-18T14:00:00.000Z",
        note: "Sanitation truck route updated for heavy pickup.",
        updatedBy: {
          uid: "demo-admin-901",
          name: "Alex Rivera",
          role: "admin",
        },
      },
      {
        id: "tl-1004-3",
        status: "Resolved",
        timestamp: "2026-11-19T08:30:00.000Z",
        note: "Waste cleared and bins sanitized by morning sanitation crew.",
        updatedBy: {
          uid: "demo-admin-901",
          name: "Alex Rivera",
          role: "admin",
        },
      },
    ],
    createdAt: "2026-11-18T11:00:00.000Z",
    updatedAt: "2026-11-19T08:30:00.000Z",
  },
  {
    id: "civic-1005",
    title: "Vague noise complaint near industrial park",
    description: "Loud humming noise heard during evening hours, cannot identify origin.",
    location: {
      address: "Near North Industrial Park border",
      lat: 37.762,
      lng: -122.395,
    },
    category: "Other",
    priority: "Low",
    department: "General Administration",
    status: "Reported",
    userId: "demo-citizen-103",
    userEmail: "sam.lee@example.org",
    userName: "Sam Lee",
    aiAnalysis: {
      category: "Other",
      priority: "Low",
      department: "General Administration",
      reasoning: "Unspecified acoustic disturbance without immediate hazard or property danger.",
      confidence: 0.65,
      modelUsed: "gemini-2.5-flash",
      isFallback: true,
      analyzedAt: "2026-11-21T02:00:00.000Z",
    },
    isManualReview: true,
    statusTimeline: [
      {
        id: "tl-1005-1",
        status: "Reported",
        timestamp: "2026-11-21T02:00:00.000Z",
        note: "Flagged for manual review due to low AI confidence threshold.",
        updatedBy: {
          uid: "demo-citizen-103",
          name: "Sam Lee",
          role: "citizen",
        },
      },
    ],
    createdAt: "2026-11-21T02:00:00.000Z",
    updatedAt: "2026-11-21T02:00:00.000Z",
  },
];

// Helper to get demo complaints from localStorage or initial fallback
function getLocalDemoComplaints(): Complaint[] {
  if (typeof window === "undefined") return INITIAL_DEMO_COMPLAINTS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_COMPLAINTS));
    return INITIAL_DEMO_COMPLAINTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_DEMO_COMPLAINTS;
  }
}

function saveLocalDemoComplaints(complaints: Complaint[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  }
}

/**
 * Fetch complaints with filtering, search, and pagination.
 */
export async function getComplaints(options?: {
  userId?: string;
  filters?: ComplaintFilters;
  pageSize?: number;
  lastDoc?: DocumentSnapshot;
}): Promise<{ complaints: Complaint[]; lastVisibleDoc?: DocumentSnapshot; totalCount: number }> {
  const { userId, filters, pageSize = 20 } = options || {};

  // If Firebase Firestore is active and configured
  if (isFirebaseConfigured && db) {
    try {
      const constraints: QueryConstraint[] = [];

      if (userId) {
        constraints.push(where("userId", "==", userId));
      }

      if (filters?.status && filters.status !== "All") {
        constraints.push(where("status", "==", filters.status));
      }

      if (filters?.priority && filters.priority !== "All") {
        constraints.push(where("priority", "==", filters.priority));
      }

      if (filters?.department && filters.department !== "All") {
        constraints.push(where("department", "==", filters.department));
      }

      if (filters?.category && filters.category !== "All") {
        constraints.push(where("category", "==", filters.category));
      }

      constraints.push(orderBy("createdAt", "desc"));
      if (options?.lastDoc) {
        constraints.push(startAfter(options.lastDoc));
      }
      constraints.push(firestoreLimit(pageSize));

      const q = query(collection(db, COLLECTION_NAME), ...constraints);
      const snapshot = await getDocs(q);

      const complaints: Complaint[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Complaint, "id">),
      }));

      // Search filtering client-side if search string is present
      const filteredComplaints = filters?.search
        ? complaints.filter(
            (c) =>
              c.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
              c.description.toLowerCase().includes(filters.search!.toLowerCase()) ||
              c.location.address.toLowerCase().includes(filters.search!.toLowerCase())
          )
        : complaints;

      const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
      return {
        complaints: filteredComplaints,
        lastVisibleDoc,
        totalCount: snapshot.size,
      };
    } catch (err) {
      console.warn("Firestore query failed, falling back to local store:", err);
    }
  }

  // Fallback: Local demo store
  let complaints = getLocalDemoComplaints();

  if (userId) {
    complaints = complaints.filter((c) => c.userId === userId);
  }

  if (filters?.status && filters.status !== "All") {
    complaints = complaints.filter((c) => c.status === filters.status);
  }

  if (filters?.priority && filters.priority !== "All") {
    complaints = complaints.filter((c) => c.priority === filters.priority);
  }

  if (filters?.department && filters.department !== "All") {
    complaints = complaints.filter((c) => c.department === filters.department);
  }

  if (filters?.category && filters.category !== "All") {
    complaints = complaints.filter((c) => c.category === filters.category);
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    complaints = complaints.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q)
    );
  }

  // Sort descending by date
  complaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalCount = complaints.length;
  const paginated = complaints.slice(0, pageSize);

  return {
    complaints: paginated,
    totalCount,
  };
}

/**
 * Fetch a single complaint by ID.
 */
export async function getComplaintById(id: string): Promise<Complaint | null> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...(snapshot.data() as Omit<Complaint, "id">) };
      }
    } catch (err) {
      console.warn("Firestore getDoc failed, falling back to local store:", err);
    }
  }

  const complaints = getLocalDemoComplaints();
  return complaints.find((c) => c.id === id) || null;
}

/**
 * Create a new complaint.
 */
export async function createComplaint(
  data: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "statusTimeline"> & {
    id?: string;
  }
): Promise<Complaint> {
  const id = data.id || `civic-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newComplaint: Complaint = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
    statusTimeline: [
      {
        id: `tl-${Date.now()}-1`,
        status: data.status || "Reported",
        timestamp: now,
        note: "Issue reported by citizen and analyzed by AI.",
        updatedBy: {
          uid: data.userId,
          name: data.userName,
          role: "citizen",
        },
      },
    ],
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await setDoc(docRef, newComplaint);
      return newComplaint;
    } catch (err) {
      console.warn("Firestore setDoc failed, saving to local store:", err);
    }
  }

  const list = getLocalDemoComplaints();
  list.unshift(newComplaint);
  saveLocalDemoComplaints(list);
  return newComplaint;
}

/**
 * Update complaint status (Admin only).
 */
export async function updateComplaintStatus(
  id: string,
  newStatus: ComplaintStatus,
  adminUser: AppUser,
  note?: string
): Promise<Complaint | null> {
  const now = new Date().toISOString();
  const timelineEntry: TimelineEntry = {
    id: `tl-${Date.now()}`,
    status: newStatus,
    timestamp: now,
    note: note || `Status updated to ${newStatus}`,
    updatedBy: {
      uid: adminUser.uid,
      name: adminUser.displayName || "Admin Officer",
      role: "admin",
    },
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const existing = snap.data() as Complaint;
        const updatedTimeline = [...(existing.statusTimeline || []), timelineEntry];
        await updateDoc(docRef, {
          status: newStatus,
          statusTimeline: updatedTimeline,
          updatedAt: now,
        });
        return {
          ...existing,
          status: newStatus,
          statusTimeline: updatedTimeline,
          updatedAt: now,
        };
      }
    } catch (err) {
      console.warn("Firestore updateDoc failed, updating local store:", err);
    }
  }

  const list = getLocalDemoComplaints();
  const index = list.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const target = list[index];
  const updated: Complaint = {
    ...target,
    status: newStatus,
    statusTimeline: [...(target.statusTimeline || []), timelineEntry],
    updatedAt: now,
  };

  list[index] = updated;
  saveLocalDemoComplaints(list);
  return updated;
}

/**
 * Override AI classification (Admin only).
 */
export async function overrideAIClassification(
  id: string,
  updates: {
    category?: ComplaintCategory;
    priority?: ComplaintPriority;
    department?: Department;
  },
  adminUser: AppUser,
  note?: string
): Promise<Complaint | null> {
  const now = new Date().toISOString();
  const complaint = await getComplaintById(id);
  if (!complaint) return null;

  const newCategory = updates.category || complaint.category;
  const newPriority = updates.priority || complaint.priority;
  const newDepartment =
    updates.department || (updates.category ? getDepartmentForCategory(updates.category) : complaint.department);

  const timelineEntry: TimelineEntry = {
    id: `tl-override-${Date.now()}`,
    status: complaint.status,
    timestamp: now,
    note:
      note ||
      `AI Classification manually adjusted: [${newCategory} | ${newPriority} | ${newDepartment}]`,
    updatedBy: {
      uid: adminUser.uid,
      name: adminUser.displayName || "Admin Officer",
      role: "admin",
    },
  };

  const updatedData: Partial<Complaint> = {
    category: newCategory,
    priority: newPriority,
    department: newDepartment,
    isManualReview: false,
    statusTimeline: [...complaint.statusTimeline, timelineEntry],
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, updatedData);
      return { ...complaint, ...updatedData };
    } catch (err) {
      console.warn("Firestore override failed, saving to local store:", err);
    }
  }

  const list = getLocalDemoComplaints();
  const index = list.findIndex((c) => c.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...updatedData };
    saveLocalDemoComplaints(list);
    return list[index];
  }

  return null;
}

/**
 * Calculates admin stats strip (totals by status and priority).
 */
export async function getAdminStats(): Promise<AdminStats> {
  const { complaints } = await getComplaints({ pageSize: 500 });

  const stats: AdminStats = {
    total: complaints.length,
    byStatus: {
      reported: 0,
      inProgress: 0,
      resolved: 0,
    },
    byPriority: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
    manualReviewCount: 0,
  };

  for (const c of complaints) {
    if (c.status === "Reported") stats.byStatus.reported++;
    else if (c.status === "In Progress") stats.byStatus.inProgress++;
    else if (c.status === "Resolved") stats.byStatus.resolved++;

    if (c.priority === "Critical") stats.byPriority.critical++;
    else if (c.priority === "High") stats.byPriority.high++;
    else if (c.priority === "Medium") stats.byPriority.medium++;
    else if (c.priority === "Low") stats.byPriority.low++;

    if (c.isManualReview) stats.manualReviewCount++;
  }

  return stats;
}
