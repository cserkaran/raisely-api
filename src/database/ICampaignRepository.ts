import { uuidv4 as uuidv4 } from 'uuid';
import { Donation } from "../models/Donation";
import { Profile } from "../models/Profile";

export interface ICampaignRepository {
    getAllProfiles(): Promise<Array<Profile> | null>;

    getProfileDonations(profileId: uuidv4): Array<Donation>;

    submitProfileDonation(donation: Donation): Promise<Donation>;

    submitCampaignDonation(donation: Donation): Promise<Donation | null>;
  }