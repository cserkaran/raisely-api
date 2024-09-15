import { v4 as uuidv4 } from 'uuid';
import { Donation } from '../models/Donation';
import { Profile } from '../models/Profile';
import { ICampaignRepository } from './ICampaignRepository';

// Impelementation of ICampaignRepository.
export class CampaignRepository implements ICampaignRepository {
  private readonly profiles: Array<Profile>;
  private readonly donations: Array<Donation>;

  constructor() {
    this.profiles = new Array<Profile>();
    this.donations = new Array<Donation>();
  }

  // Get the Campaign Profile/Root Profile.
  public async getRootProfile(): Promise<Profile | null> {
    let rootProfile = this.profiles.find((p) => p.parentId == null);
    if (rootProfile == undefined) {
      return null;
    }
    return rootProfile;
  }

  // Get Profile for a given Profile ID
  public async getProfileById(profileId: string | null): Promise<Profile | null> {
    let profile = this.profiles.find((p) => p.id == profileId);
    if (profile == undefined) {
      return null;
    }
    return profile;
  }

  // Get All the Profiles.
  public async getAllProfiles(): Promise<Array<Profile>> {
    return this.profiles;
  }

  // Get a single profile's donations
  public async getProfileDonations(
    profileId: string
  ): Promise<Array<Donation>> {
    const donations = this.donations.filter(d => d.profileId === profileId);
    return donations;
  }

  // Create a new Profile
  public async createProfile(profile: Profile): Promise<Profile | null> {
    profile.id = uuidv4();
    this.profiles.push(profile);
    return profile;
  }

  // Create a new donation
  public async createDonation(donation: Donation): Promise<Donation | null> {
    donation.id = uuidv4();
    this.donations.push(donation);
    return donation;
  }
}
