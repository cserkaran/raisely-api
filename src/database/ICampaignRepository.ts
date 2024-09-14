import { uuidv4 as uuidv4 } from 'uuid';
import { Donation } from "../models/Donation";
import { Profile } from "../models/Profile";

export interface ICampaignRepository {
    
    getProfile(profileId: uuidv4): Promise<Profile | null>;

    getAllProfiles(): Promise<Array<Profile>>;

    getProfileDonations(profileId: uuidv4): Promise<Array<Donation>>;

    submitProfileDonation(donation: Donation): Promise<Donation | null>;

    submitCampaignDonation(donation: Donation): Promise<Donation | null>;
  }