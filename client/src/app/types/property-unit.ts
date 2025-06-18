import { z } from 'zod';

export const propertyUnitFormSchema = z.object({
  property_project: z.string().uuid({ message: 'Invalid project ID' }),
  unit_name: z.string().min(1, 'Unit name is required'),
  unit_type: z.enum(['apartment', 'villa', 'office', 'shop', '']),
  contract_type: z.enum(['rent', 'sale', 'lease']),
  purpose: z.enum(['residential', 'commercial', '']),
  price: z.number().nonnegative(),
  available: z.boolean(),
  is_listed_for_rent: z.boolean().optional(),
  is_listed_for_sale: z.boolean().optional(),
  amenities: z.object({
    private_pool: z.boolean(),
    wifi: z.boolean(),
    gym: z.boolean(),
    // security: z.boolean(),
    // bed_rooms: z.number().int().min(0, 'Number of bedrooms must be 0 or more'),
  }),
});

export type PropertyUnitFormData = z.infer<typeof propertyUnitFormSchema>;
