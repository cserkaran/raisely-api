import { Profile } from '../models/Profile';
import { Donation } from '../models/Donation';
import { uuidv4 as uuidv4 } from 'uuid';
import { ICampaignRepository } from '../database/ICampaignRepository';
import { IErrorResponse } from '../models/ResponseBodies';

export class CampaignService {
  private campaignRepository: ICampaignRepository;
  private exchangeRates = {
    USD: 1,
    AUD: 0.74,
    EUR: 1.18,
  };

  constructor(campaignRepository: ICampaignRepository) {
    this.campaignRepository = campaignRepository;
  }

  // create root campaign/team profile.
  public async createCampaignProfile(
    profile: Profile
  ): Promise<Profile | null> {
    const { name, total, currency } = profile;
    const newProfile = {
      id: null, // will be set by database layer.
      name: name,
      total: total,
      parentId: null, // parent id null for root campaign profile.
      currency: currency,
    };

    const result = await this.campaignRepository.addProfile(newProfile);
    return result;
  }

  //create individual fundraising profile.
  public async createIndividualProfile(
    parent: uuidv4,
    profile: Profile
  ): Promise<Profile | null> {
    const { name, total, currency } = profile;
    const newProfile = {
      id: null, // will be set by database layer.
      name: name,
      total: total,
      parentId: parent,
      currency: currency,
    };

    const result = await this.campaignRepository.addProfile(newProfile);
    return result;
  }

  // Fetch all profiles
  public async getProfile(profileId: uuidv4): Promise<Profile | null> {
    return this.campaignRepository.getProfileById(profileId);
  }

  // Fetch all profiles
  public async getAllProfiles(): Promise<Array<Profile>> {
    return this.campaignRepository.getAllProfiles();
  }

  // Fetch donations for a profile
  public async getProfileDonations(
    profileId: uuidv4
  ): Promise<Array<Donation>> {
    return this.campaignRepository.getProfileDonations(profileId);
  }

  // Submit a donation to a specific profile
  public async submitProfileDonation(
    profileId: uuidv4,
    donation: Donation
  ): Promise<Donation | IErrorResponse> {
    const profile = await this.campaignRepository.getProfileById(profileId);
    if (!profile) {
      return { statusCode: 404, error: 'Profile not found' };
    }

    const { donorName, amount, currency } = donation;
    const donationAmountInProfileCurrency =
      (amount * this.exchangeRates[currency]) /
      this.exchangeRates[profile.currency];

    const newDonation = {
      id: null, // will be set by database layer.
      donorName,
      amount,
      currency,
      profileId: profile,
    };

    const result = await this.campaignRepository.addDonation(newDonation);

    // Update profile total and parent profiles' totals
    let currentProfile = profile;
    while (currentProfile) {
      currentProfile.total += donationAmountInProfileCurrency;
      currentProfile = await this.campaignRepository.getProfileById(
        currentProfile.parentId
      );
    }

    return result;
  }

  // Submit a donation to the campaign (root profile)
  public async submitCampaignDonation(
    campaign: string,
    donation: Donation
  ): Promise<Donation | IErrorResponse> {
    const { donorName, amount, currency } = donation;
    const rootProfile =
      await this.campaignRepository.getProfileByName(campaign);
    if (!rootProfile) {
      return {
        statusCode: 404,
        error: `Campaign Profile with name ${campaign} witnot found`,
      };
    }
    const donationAmountInUSD = amount * this.exchangeRates[currency];
    rootProfile.total += donationAmountInUSD;

    const newDonation = {
      id: null, //Will be set by database layer.
      donorName,
      amount,
      currency,
      profileId: rootProfile.id,
    };

    const result = await this.campaignRepository.addDonation(newDonation);
    return donation;
  }
}
