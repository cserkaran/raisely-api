import { uuidv4 as uuidv4 } from 'uuid';
import { Donation } from '../models/Donation';
import { Profile } from '../models/Profile';
import { ICampaignRepository } from './ICampaignRepository';

export class CampaignRepository implements ICampaignRepository {

  profiles = new Array<Profile>();
  donations = new Array<Donation>();

  public async getProfile(profileId: uuidv4): Promise<Profile | null> {
     let profile = this.profiles.find(p => p.id == profileId);
     if(profile == undefined) { 
        profile = null;
     }
     return profile;
  }

  public async getAllProfiles(): Promise<Array<Profile>> {
      return this.profiles;
  }

  public async getProfileDonations(profileId: uuidv4): Promise<Array<Donation>> {
     return this.donations;
  }

  public async submitProfileDonation(donation: Donation): Promise<Donation> {
    throw new Error('Method not implemented.');
  }

  public async submitCampaignDonation(donation: Donation): Promise<Donation | null> {
    throw new Error('Method not implemented.');
  }
}
