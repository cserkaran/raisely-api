import { uuidv4 as uuidv4 } from 'uuid';
import { Donation } from '../models/Donation';
import { Profile } from '../models/Profile';
import { ICampaignRepository } from './ICampaignRepository';

export class CampaignRepository implements ICampaignRepository {
  private readonly profiles: Array<Profile>;
  private readonly donations: Array<Donation>;

  constructor() {
    this.profiles = new Array<Profile>();
    this.donations = new Array<Donation>();
  }

  public async getProfileById(profileId: uuidv4): Promise<Profile | null> {
    let profile = this.profiles.find((p) => p.id == profileId);
    if (profile == undefined) {
      profile = null;
    }
    return profile;
  }

  public async getProfileByName(name: string): Promise<Profile | null> {
    let profile = this.profiles.find((p) => p.name == name);
    if (profile == undefined) {
      profile = null;
    }
    return profile;
  }

  public async getAllProfiles(): Promise<Array<Profile>> {
    return this.profiles;
  }

  public async getProfileDonations(
    profileId: uuidv4
  ): Promise<Array<Donation>> {
    return this.donations;
  }

  public async addProfile(profile: Profile): Promise<Profile | null> {
    profile.id = uuidv4();
    this.profiles.push(profile);
    return profile;
  }

  public async addDonation(donation: Donation): Promise<Donation | null> {
    donation.id = uuidv4();
    this.donations.push(donation);
    return donation;
  }
}
