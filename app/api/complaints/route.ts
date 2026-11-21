import { NextRequest, NextResponse } from "next/server";
import { ReportFormSchema } from "@/lib/validation/schemas";
import { classifyComplaint } from "@/lib/gemini/classify";
import { getAdminAuth } from "@/lib/firebase/admin";
import { getDepartmentForCategory } from "@/lib/constants";
import type { ApiResponse } from "@/types/api";
import type { Complaint } from "@/types/complaint";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Auth
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  let uid = "demo-citizen-anon";
  let email: string | null = null;
  let displayName = "Anonymous Citizen";

  const adminAuth = getAdminAuth();
  if (adminAuth && token) {
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
      email = decoded.email ?? null;
      displayName = decoded.name ?? "Citizen";
    } catch {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }
  }

  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Invalid JSON." },
      { status: 400 }
    );
  }

  // Validate - extract user info from body too
  const bodyWithUser = body as Record<string, unknown>;
  const parsed = ReportFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // If uid wasn't from token (demo mode), try from body
  if (uid === "demo-citizen-anon" && bodyWithUser.userId) {
    uid = String(bodyWithUser.userId);
    email = String(bodyWithUser.userEmail ?? "");
    displayName = String(bodyWithUser.userName ?? "Citizen");
  }

  // AI Classification
  const analysis = await classifyComplaint(parsed.data);

  const id = `civic-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const complaint: Complaint = {
    id,
    title: parsed.data.title,
    description: parsed.data.description,
    location: { address: parsed.data.location },
    category: analysis.category,
    priority: analysis.priority,
    department: getDepartmentForCategory(analysis.category),
    status: "Reported",
    imageBase64: parsed.data.imageBase64 || undefined,
    userId: uid,
    userEmail: email ?? "",
    userName: displayName,
    aiAnalysis: analysis,
    isManualReview: analysis.isFallback || analysis.confidence < 0.6,
    statusTimeline: [
      {
        id: `tl-${Date.now()}-1`,
        status: "Reported",
        timestamp: now,
        note: analysis.isFallback
          ? "Issue reported. AI classification unavailable — flagged for manual review."
          : `AI classified as ${analysis.category} (${Math.round(analysis.confidence * 100)}% confidence).`,
        updatedBy: { uid, name: displayName, role: "citizen" },
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  return NextResponse.json<ApiResponse<Complaint>>({ success: true, data: complaint });
}
