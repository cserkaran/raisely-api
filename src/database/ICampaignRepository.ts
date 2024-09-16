import { Donation } from '../models/Donation';
import { Profile } from '../models/Profile';

// Repository interface to abstract data access logic,
// providing a clean API for accessing data and separating concerns between the data
// layer and the business logic layer.
export interface ICampaignRepository {
  // Get the Campaign Profile/Root Profile.
  getRootProfile(): Promise<Profile | null>;

  // Get Profile for a given Profile ID
  getProfileById(profileId: string | null): Promise<Profile | null>;

  // Get All the Profiles.
  getAllProfiles(): Promise<Array<Profile>>;

  //Get a single profile's donations
  getProfileDonations(profileId: string): Promise<Array<Donation>>;

  // Create a new Profile
  createProfile(profile: Profile): Promise<Profile | null>;

  // Create a new donation
  createDonation(donation: Donation): Promise<Donation | null>;
}
