import { uuidv4 as uuidv4 } from 'uuid';
import { Donation } from '../models/Donation';
import { Profile } from '../models/Profile';
import { ICampaignRepository } from './ICampaignRepository';

export class CampaignRepository implements ICampaignRepository {
  profiles = new Array<Profile>();
  donations = new Array<Donation>();

  getAllProfiles(): Promise<Array<Profile> | null> {
    throw new Error('Method not implemented.');
  }

  getProfileDonations(profileId: uuidv4): Array<Donation> {
    throw new Error('Method not implemented.');
  }

  submitProfileDonation(donation: Donation): Promise<Donation> {
    throw new Error('Method not implemented.');
  }

  submitCampaignDonation(donation: Donation): Promise<Donation | null> {
    throw new Error('Method not implemented.');
  }
}
