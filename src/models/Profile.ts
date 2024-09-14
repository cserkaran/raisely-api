import { uuidv4 as uuidv4 } from 'uuid';

export interface Profile {
  id: uuidv4; // UUID v4
  name: string; // Display name of the profile
  total: number; // Total amount raised in cents
  parentId: string | null; // ID of the parent profile, or null if it's a root profile
  currency: string; // Currency code (e.g., 'USD', 'AUD')
}
