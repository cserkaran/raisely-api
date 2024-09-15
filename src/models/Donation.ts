// The shape of the Donation to a fundraising profile.
export interface Donation {
  id: string; // ID of the donation
  donorName: string; // Full name of the donor
  amount: number; // Donation amount in cents
  currency: string; // Currency code (e.g., 'USD', 'AUD')
  profileId: string; // ID of the profile the donation is made to
}
