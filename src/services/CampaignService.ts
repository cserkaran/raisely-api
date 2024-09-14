import { Profile } from '../models/Profile';
import { Donation } from '../models/Donation';
import { uuidv4 as uuidv4 } from 'uuid';

export class CampaignService {
  // Fetch all profiles
  getAllProfiles(): Array<Profile> {
    return [];
  }
  // Fetch donations for a profile
  getProfileDonations(profileId: uuidv4): Array<Donation> {
    return [];
  }

  // Submit a donation to a specific profile
  submitProfileDonation(donation: Donation): Donation {
    return null;
  }

  // Submit a donation to the campaign (root profile)
  submitCampaignDonation(donation: Donation): Donation {
    return null;
  }
}
