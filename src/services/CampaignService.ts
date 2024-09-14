import { Profile } from '../models/Profile';
import { Donation } from '../models/Donation';
import { uuidv4 as uuidv4 } from 'uuid';
import { ICampaignRepository } from '../database/ICampaignRepository';

export class CampaignService {
  
  private campaignRepository: ICampaignRepository;

  constructor(campaignRepository: ICampaignRepository){
    this.campaignRepository = campaignRepository;
  }

   // Fetch all profiles
  public async getAllProfiles(): Promise<Array<Profile>> {
     return this.campaignRepository.getAllProfiles();
  }

  // Fetch donations for a profile
  getProfileDonations(profileId: uuidv4): Promise<Array<Donation>> {
    return this.campaignRepository.getProfileDonations(profileId);
  }

  // Submit a donation to a specific profile
  submitProfileDonation(donation: Donation): Promise<Donation> {
    return null;
  }

  // Submit a donation to the campaign (root profile)
  submitCampaignDonation(donation: Donation): Donation {
    return null;
  }
}
