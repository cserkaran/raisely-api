import { Donation } from '../models/Donation';
import { Profile } from '../models/Profile';

export interface ICampaignRepository {
  getRootProfile(): Promise<Profile | null>;

  getProfileById(profileId: string | null): Promise<Profile | null>;

  getAllProfiles(): Promise<Array<Profile>>;

  getProfileDonations(profileId: string): Promise<Array<Donation>>;

  addProfile(profile: Profile): Promise<Profile | null>;

  addDonation(donation: Donation): Promise<Donation | null>;
}
