import { uuidv4 as uuidv4 } from 'uuid';

export interface Donation {
  id: uuidv4; // UUID v4
  donorName: string; // Full name of the donor
  amount: number; // Donation amount in cents
  currency: string; // Currency code (e.g., 'USD', 'AUD')
  profileId: uuidv4; // ID of the profile the donation is made to
}
