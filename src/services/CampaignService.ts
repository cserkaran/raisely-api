import { Profile } from '../models/Profile';
import { Donation } from '../models/Donation';
import { ICampaignRepository } from '../database/ICampaignRepository';
import { IErrorResponse } from '../models/ResponseBodies';

export class CampaignService {
  private campaignRepository: ICampaignRepository;
  private exchangeRates: ExchangeRateData = {
    rates: {
      USD: 1,
      AUD: 0.74,
      EUR: 1.18,
    },
  };

  constructor(campaignRepository: ICampaignRepository) {
    this.campaignRepository = campaignRepository;
  }

  // create profile.
  public async createProfile(
    profile: Profile
  ): Promise<Profile | IErrorResponse> {
    const { name, total, currency, parentId } = profile;

    if (!parentId) {
      //Check if root profile already exists as we cannot have multiple root profiles.
      const rootProfile = await this.campaignRepository.getRootProfile();
      if (rootProfile) {
        return {
          statusCode: 400,
          error: `Campaign Root Profile already exists`,
        };
      }
    }

    const newProfile = {
      id: '', // will be set by database layer.
      name: name,
      total: total,
      parentId: parentId,
      currency: currency,
    };

    const result = await this.campaignRepository.addProfile(newProfile);
    return result as Profile;
  }

  // Fetch profile by id
  public async getProfileById(
    profileId: string | null
  ): Promise<Profile | null> {
    return this.campaignRepository.getProfileById(profileId);
  }

  // Fetch all profiles
  public async getAllProfiles(): Promise<Array<Profile>> {
    return this.campaignRepository.getAllProfiles();
  }

  // Fetch donations for a profile
  public async getProfileDonations(
    profileId: string
  ): Promise<Array<Donation>> {
    return this.campaignRepository.getProfileDonations(profileId);
  }

  // Submit a donation to a specific profile
  public async submitProfileDonation(
    profileId: string,
    donation: Donation
  ): Promise<Donation | IErrorResponse> {
    const profile = await this.campaignRepository.getProfileById(profileId);
    if (!profile) {
      return { statusCode: 404, error: 'Profile not found' };
    }

    const { donorName, amount, currency } = donation;
    const donationAmountInProfileCurrency =
      (amount * this.exchangeRates.rates[currency]) /
      this.exchangeRates.rates[profile.currency];

    const newDonation = {
      id: '', // will be set by database layer.
      donorName,
      amount,
      currency,
      profileId: profileId,
    };

    const result = await this.campaignRepository.addDonation(newDonation);

    // Update profile total and parent profiles' totals
    let currentProfile: Profile | null;
    currentProfile = profile;
    while (currentProfile) {
      currentProfile.total += donationAmountInProfileCurrency;
      currentProfile = await this.campaignRepository.getProfileById(
        currentProfile.parentId
      );
    }

    return result as Donation;
  }

  // Submit a donation to the campaign (root profile)
  public async submitCampaignDonation(
    donation: Donation
  ): Promise<Donation | IErrorResponse> {
    const { donorName, amount, currency } = donation;
    const rootProfile = await this.campaignRepository.getRootProfile();
    if (!rootProfile) {
      return {
        statusCode: 404,
        error: `Campaign Root Profile not found`,
      };
    }
    const donationAmountInUSD = amount * this.exchangeRates.rates[currency];
    rootProfile.total += donationAmountInUSD;

    const newDonation = {
      id: '', //Will be set by database layer.
      donorName,
      amount,
      currency,
      profileId: rootProfile.id,
    };

    const result = await this.campaignRepository.addDonation(newDonation);
    return donation;
  }
}
