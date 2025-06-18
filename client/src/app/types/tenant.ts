import { z } from "zod";

// Zod schema for tenant list items (from dummyTenants)
export const tenantSchema = z.object({
  id: z.number(),
  avatar: z.string().url(),
  first_name: z.string(),
  last_name: z.string(),
  gender: z.enum(["male", "female", "other", ""]),
  id_type: z.enum(["passport_number", "national_id"]),
  passport_number: z.string().nullable().optional(),
  national_id: z.string().nullable().optional(),
  property_unit: z.string(),
  tenancy: z.object({
    property_unit_id: z.string(),
    property_unit_name: z.string(),
    tenancy_start_date: z.string(), // ISO date string
    tenancy_end_date: z.string(),   // ISO date string
  }).optional(),
  tenancy_start_date: z.string(), // ISO date string
  tenancy_end_date: z.string(),   // ISO date string
});
  


export type Tenant = z.infer<typeof tenantSchema>;

// Zod schema for the form (with Date | null for dates)
export const tenantFormSchema = tenantSchema.omit({ id: true, tenancy_start_date: true, tenancy_end_date: true }).extend({
  avatar: z.string().url().optional().or(z.literal("")),
  tenancy_start_date: z.date({ required_error: "Start date is required" }).nullable(),
  tenancy_end_date: z.date({ required_error: "End date is required" }).nullable(),
});



export type TenantFormData = z.infer<typeof tenantFormSchema>;
