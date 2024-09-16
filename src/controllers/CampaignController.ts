import { Request, Response } from 'express';
import { CampaignService } from '../services/CampaignService';
import {
  IDonationResultBody,
  IDonationsResultBody,
  IErrorMessage,
  IProfileResultBody,
  IProfilesResultBody,
} from '../models/ResponseBodies';
import {
  ICreateProfileRequestBody,
  IGetProfileRequestBody,
  ISubmitDonationRequestBody,
} from '../models/RequestBodies';
import { isErrorReponse } from '../helpers/typepredicates';

// An MVC Controller(Model-View-Controller) for handling
// request and response logic for the applications routes.
export class CampaignController {
  private campaignService: CampaignService;

  // Class Constructor
  constructor(campaignService: CampaignService) {
    this.campaignService = campaignService;
  }

  // Get all the fundraising profiles
  public async getAllProfiles(
    req: Request,
    res: Response<IProfilesResultBody>
  ): Promise<void> {
    const profiles = await this.campaignService.getAllProfiles();
    res.json({
      profiles: profiles,
    });
  }

  // Get a single profile's donations
  public async getProfileDonations(
    req: Request<IGetProfileRequestBody>,
    res: Response<IDonationsResultBody>
  ): Promise<void> {
    const profileId = req.params.profile;
    const donations = await this.campaignService.getProfileDonations(profileId);
    res.json({
      donations: donations,
    });
  }

  // Create profile for fundraising
  public async createProfile(
    req: Request<{}, {}, ICreateProfileRequestBody>,
    res: Response<IProfileResultBody | IErrorMessage>
  ): Promise<void> {
    const { profile } = req.body;
    const result = await this.campaignService.createProfile(profile);

    if (isErrorReponse(result)) {
      res.status(result.statusCode).json({ error: result.error });
    } else {
      res.status(201).json({
        profile: result,
      });
    }
  }

  // Submit a new donation to the profile with the given Profile ID
  public async submitProfileDonation(
    req: Request<IGetProfileRequestBody, {}, ISubmitDonationRequestBody>,
    res: Response<IDonationResultBody | IErrorMessage>
  ): Promise<void> {
    const profile = req.params.profile;
    const { donation } = req.body;
    const result = await this.campaignService.submitProfileDonation(
      profile,
      donation
    );
    if (isErrorReponse(result)) {
      res.status(result.statusCode).json({ error: result.error });
    } else {
      res.status(201).json({
        donation: result,
      });
    }
  }

  // Submit a new donation to the overall campaign(root profile)
  public async submitCampaignDonation(
    req: Request<{}, {}, ISubmitDonationRequestBody>,
    res: Response<IDonationResultBody | IErrorMessage>
  ): Promise<void> {
    const { donation } = req.body;
    const result = await this.campaignService.submitCampaignDonation(donation);
    if (isErrorReponse(result)) {
      res.status(result.statusCode).json({ error: result.error });
    } else {
      res.status(201).json({
        donation: result,
      });
    }
  }
}
