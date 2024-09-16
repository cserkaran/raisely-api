import { Profile } from '../models/Profile';
import { Donation } from '../models/Donation';
import { ICampaignRepository } from '../database/ICampaignRepository';
import { IErrorResponse } from '../models/ResponseBodies';

// Contains methods for business logic. It calls the data access layer(Repository)
// and model layer to perform data operations.
export class CampaignService {
  private campaignRepository: ICampaignRepository;
  private static exchangeRates: ExchangeRateData = {
    rates: {
      USD: 1,
      AUD: 0.74,
      EUR: 1.18,
    },
  };

  // Class Constructor
  constructor(campaignRepository: ICampaignRepository) {
    this.campaignRepository = campaignRepository;
  }

  // Get all the fundraising profiles
  public async getAllProfiles(): Promise<Array<Profile>> {
    return this.campaignRepository.getAllProfiles();
  }

  // Get a single profile's donations
  public async getProfileDonations(
    profileId: string
  ): Promise<Array<Donation>> {
    return this.campaignRepository.getProfileDonations(profileId);
  }

  // Create profile for fundraising
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

    const result = await this.campaignRepository.createProfile(newProfile);
    return result as Profile;
  }

  // Submit a new donation to the profile with the given Profile ID
  public async submitProfileDonation(
    profileId: string,
    donation: Donation
  ): Promise<Donation | IErrorResponse> {
    const profile = await this.campaignRepository.getProfileById(profileId);
    if (!profile) {
      return { statusCode: 404, error: 'Profile not found' };
    }
    return CampaignService.submitDonation(
      donation,
      profile,
      this.campaignRepository
    );
  }

  // Submit a new donation to the overall campaign(root profile)
  public async submitCampaignDonation(
    donation: Donation
  ): Promise<Donation | IErrorResponse> {
    const rootProfile = await this.campaignRepository.getRootProfile();
    if (!rootProfile) {
      return {
        statusCode: 404,
        error: `Campaign Root Profile not found`,
      };
    }
    return CampaignService.submitDonation(
      donation,
      rootProfile,
      this.campaignRepository
    );
  }

  // Submit donation to a given profile.
  private static async submitDonation(
    donation: Donation,
    profile: Profile,
    campaignRepository: ICampaignRepository
  ): Promise<Donation> {
    const { donorName, amount, currency } = donation;

    const newDonation = {
      id: '', // will be set by database layer.
      donorName,
      amount,
      currency,
      profileId: profile.id,
    };

    // charge card here
    // and then, save the donation to database.
    // These two operations need to be part of one transaction
    // or we can build a distributed payment processor to handle
    // failures.
    const result = await campaignRepository.createDonation(newDonation);

    // Update profile total and parent profiles hierarchy totals
    let currentProfile: Profile | null;
    currentProfile = profile;
    while (currentProfile) {
      // Transform donation amount to
      // profiles currency.
      const donationAmountInProfileCurrency = CampaignService.TransformAmount(
        amount,
        currency,
        currentProfile.currency
      );
      currentProfile.total += donationAmountInProfileCurrency;
      currentProfile = await campaignRepository.getProfileById(
        currentProfile.parentId
      );
    }

    return result as Donation;
  }

  // Transform amount in from currency to a destination currency.
  private static TransformAmount(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): number {
    return (
      (amount * CampaignService.exchangeRates.rates[fromCurrency]) /
      CampaignService.exchangeRates.rates[toCurrency]
    );
  }
}
