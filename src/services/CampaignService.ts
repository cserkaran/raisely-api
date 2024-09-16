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

  // Get all the fundraising profiles
  public async getProfileById(
    profileId: string | null
  ): Promise<Profile | null> {
    return this.campaignRepository.getProfileById(profileId);
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

  // Submit a new donation to the profile with the given Profile ID
  public async submitProfileDonation(
    profileId: string,
    donation: Donation
  ): Promise<Donation | IErrorResponse> {
    const profile = await this.campaignRepository.getProfileById(profileId);
    if (!profile) {
      return { statusCode: 404, error: 'Profile not found' };
    }

    const { donorName, amount, currency } = donation;

    const newDonation = {
      id: '', // will be set by database layer.
      donorName,
      amount,
      currency,
      profileId: profileId,
    };

    // charge card here
    // and then, save the donation to database.
    // These two operations need to be part of one transaction
    // or we can build a distributed payment processor to handle
    // failures.
    const result = await this.campaignRepository.createDonation(newDonation);

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

  // Submit a new donation to the overall campaign(root profile)
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

    // charge card here
    // and then, save the donation to database.
    // These two operations need to be part of one transaction
    // or we can build a distributed payment processor to handle
    // failures.
    const result = await this.campaignRepository.createDonation(newDonation);
    return donation;
  }
}
