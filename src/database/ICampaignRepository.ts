import { uuidv4 as uuidv4 } from 'uuid';
import { Donation } from "../models/Donation";
import { Profile } from "../models/Profile";

export interface ICampaignRepository {
    
    getProfile(profileId: uuidv4): Promise<Profile | null>;

    getAllProfiles(): Promise<Array<Profile>>;

    getProfileDonations(profileId: uuidv4): Promise<Array<Donation>>;

    addProfile(profile: Profile): Promise<Profile | null>;
    
    addDonation(donation: Donation): Promise<Donation | null>;
  }