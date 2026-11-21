import { NextRequest, NextResponse } from "next/server";
import { AdminUpdateSchema, AdminOverrideSchema } from "@/lib/validation/schemas";
import { getAdminAuth } from "@/lib/firebase/admin";
import { getDepartmentForCategory } from "@/lib/constants";
import type { ApiResponse } from "@/types/api";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;

  // Auth
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const adminAuth = getAdminAuth();
  if (adminAuth && token) {
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      const isAdmin = Boolean(decoded.admin);
      if (!isAdmin) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "Forbidden — admin access required." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Invalid JSON." },
      { status: 400 }
    );
  }

  const bodyObj = body as Record<string, unknown>;
  const action = bodyObj.action as string | undefined;

  if (action === "override") {
    const parsed = AdminOverrideSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Validation failed" },
        { status: 422 }
      );
    }
    const updates = parsed.data;
    const dept = updates.category
      ? getDepartmentForCategory(updates.category)
      : updates.department;
    return NextResponse.json<ApiResponse<{ id: string; updates: typeof updates & { department?: string } }>>({
      success: true,
      data: { id, updates: { ...updates, department: dept } },
    });
  }

  // Default: status update
  const parsed = AdminUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  return NextResponse.json<ApiResponse<{ id: string; status: string; note?: string }>>({
    success: true,
    data: { id, status: parsed.data.status, note: parsed.data.note },
  });
}
