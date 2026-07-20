import z from "zod";

export const KYCStatusSchema = z.enum(["pending", "approved", "rejected", "draft"]);

export const KYCApplicationBaseSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.email({ message: "Invalid email address" }),
});

export const KYCApplicationSubmitSchema = KYCApplicationBaseSchema.extend({
  idFile: z.file("ID file is required")
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must be less than 10MB",
    }),
});

export const KYCApplicationSchema = KYCApplicationBaseSchema.extend({
  id: z.string(),
  idFileHash: z.string(),
  status: KYCStatusSchema,
  submittedAt: z.date(),
  expiringAt: z.date().nullable().optional(),
});

export const KYCStatisticsSchema = z.object({
  total_applications: z.number(),
  pending_applications: z.number(),
  approved_applications: z.number(),
  rejected_applications: z.number(),
});

export type KYCApplication = z.infer<typeof KYCApplicationSchema>;
export type KYCApplicationBase = z.infer<typeof KYCApplicationBaseSchema>;
export type KYCApplicationSubmit = z.infer<typeof KYCApplicationSubmitSchema>;
export type KYCStatistics = z.infer<typeof KYCStatisticsSchema>;
