import { z } from "zod";

export const CATEGORIES = [
  "Pothole/Road",
  "Garbage/Sanitation",
  "Streetlight/Electrical",
  "Water/Drainage",
  "Other",
] as const;

export const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
export const STATUSES = ["Reported", "In Progress", "Resolved"] as const;
export const DEPARTMENTS = [
  "Public Works",
  "Sanitation",
  "Electricity Board",
  "Water Board",
  "General Administration",
] as const;

/** Schema for the complaint report submission */
export const ReportFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be 200 characters or fewer")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be 2000 characters or fewer")
    .trim(),
  location: z
    .string()
    .min(1, "Location is required")
    .max(300, "Location must be 300 characters or fewer")
    .trim(),
  category: z.enum(CATEGORIES).optional(),
  // base64 image: "data:image/jpeg;base64,..." max ~200 KB of base64 chars
  imageBase64: z
    .string()
    .max(200_000, "Image is too large after compression (max ~150 KB)")
    .refine(
      (val) => val === "" || val.startsWith("data:image/"),
      "Invalid image format"
    )
    .optional(),
});

export type ReportFormInput = z.infer<typeof ReportFormSchema>;

/** Schema for the /api/classify POST body */
export const ClassifyRequestSchema = ReportFormSchema;

/** Schema for admin status update */
export const AdminUpdateSchema = z.object({
  status: z.enum(STATUSES),
  note: z
    .string()
    .max(500, "Note must be 500 characters or fewer")
    .trim()
    .optional(),
});

/** Schema for admin AI classification override */
export const AdminOverrideSchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  priority: z.enum(PRIORITIES).optional(),
  department: z.enum(DEPARTMENTS).optional(),
  note: z.string().max(500).trim().optional(),
});

/** Validates the JSON output from Gemini against the expected shape */
export const GeminiOutputSchema = z.object({
  category: z.enum(CATEGORIES),
  priority: z.enum(PRIORITIES),
  department: z.enum(DEPARTMENTS),
  reasoning: z.string().max(300),
  confidence: z.number().min(0).max(1),
});

export type GeminiOutput = z.infer<typeof GeminiOutputSchema>;
