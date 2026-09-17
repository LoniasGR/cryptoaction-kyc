import { Block } from "@tanstack/react-router";
import z from "zod";

export const KYCStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED", "DRAFT"]);

export const KYCApplicationBaseSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.email({ message: "Invalid email address" }),
});

export const KYCApplicationExtendedSchema = KYCApplicationBaseSchema.extend({
  blockchainAddress: z.string().startsWith("0x", { message: "Blockchain address must start with '0x'" }),
});

export const KYCApplicationSubmitSchema = KYCApplicationExtendedSchema.extend({
  idFile: z.file("ID file is required")
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must be less than 10MB",
    }),
});

export const KYCApplicationSubmitToHash = KYCApplicationExtendedSchema.extend({
  idFileHash: z.string(),
});

export const KYCApplicationSubmitWithDigestSchema = KYCApplicationSubmitSchema.extend({
  digest: z.string(),
});

export const KYCApplicationSchema = KYCApplicationBaseSchema.extend({
  id: z.string(),
  idFileHash: z.string(),
  digest: z.string(),
  verified: z.boolean(),
  status: KYCStatusSchema,
  submittedAt: z.date(),
  blockchainAddress: z.string(),
  expiringAt: z.date().nullable().optional(),
});

export const KYCStatisticsSchema = z.object({
  total_applications: z.number(),
  pending_applications: z.number(),
  approved_applications: z.number(),
  rejected_applications: z.number(),
});

export const Hex32ByteSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, { message: "Must be a 32-byte hex string" });

export type KYCApplication = z.infer<typeof KYCApplicationSchema>;
export type KYCApplicationBase = z.infer<typeof KYCApplicationBaseSchema>;
export type KYCApplicationSubmit = z.infer<typeof KYCApplicationSubmitSchema>;
export type KYCApplicationSubmitToHash = z.infer<typeof KYCApplicationSubmitToHash>;
export type KYCApplicationSubmitWithDigest = z.infer<typeof KYCApplicationSubmitWithDigestSchema>;
export type KYCStatistics = z.infer<typeof KYCStatisticsSchema>;
export type KYCStatus = z.infer<typeof KYCStatusSchema>;
export type Hex32Byte = z.infer<typeof Hex32ByteSchema>;