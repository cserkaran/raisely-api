// Shape of Fundraising profile
export interface Profile {
  id: string; // ID of the profile
  name: string; // Display name of the profile
  total: number; // Total amount raised in cents
  parentId: string | null; // ID of the parent profile, or null if it's a root profile
  currency: string; // Currency code (e.g., 'USD', 'AUD')
}
