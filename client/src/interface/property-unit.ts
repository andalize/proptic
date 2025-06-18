
export interface PropertyUnit {
  id: string;
  property_project_name: string;
  unit_name: string;
  unit_type?: string;
  purpose?: string;
  price: string;
  is_listed_for_rent?: boolean;
  is_listed_for_sale?: boolean;
  amenities: Record<string, string | boolean>;
  created_at?: string;
}