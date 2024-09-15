import { Request, Response } from 'express';
import { CampaignService } from '../services/CampaignService';
import {
  IDonationResultBody,
  IDonationsResultBody,
  IErrorMessage,
  IErrorResponse,
  IProfileResultBody,
  IProfilesResultBody,
} from '../models/ResponseBodies';
import {
  ICreateProfileRequestBody,
  IGetProfileRequestBody,
  ISubmitDonationRequestBody,
} from '../models/RequestBodies';
import { isErrorReponse } from '../helpers/typepredicates';

export class CampaignController {
  private campaignService: CampaignService;

  constructor(campaignService: CampaignService) {
    this.campaignService = campaignService;
  }

  public async createProfile(
    req: Request<{}, {}, ICreateProfileRequestBody>,
    res: Response<IProfileResultBody | IErrorMessage>
  ): Promise<void> {
    const { profile } = req.body;
    const result = await this.campaignService.createProfile(profile);

    if (isErrorReponse(result)) {
      res.status(result.statusCode).json({ error: result.error });
    } else {
      res.json({
        profile: result,
      });
    }
  }

  public async getAllProfiles(
    req: Request,
    res: Response<IProfilesResultBody>
  ): Promise<void> {
    const profiles = await this.campaignService.getAllProfiles();
    res.json({
      profiles: profiles,
    });
  }

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
      res.json({
        donation: result,
      });
    }
  }

  public async submitCampaignDonation(
    req: Request<{}, {}, ISubmitDonationRequestBody>,
    res: Response<IDonationResultBody | IErrorMessage>
  ): Promise<void> {
    const { donation } = req.body;
    const result = await this.campaignService.submitCampaignDonation(donation);
    if (isErrorReponse(result)) {
      res.status(result.statusCode).json({ error: result.error });
    } else {
      res.json({
        donation: result,
      });
    }
  }
}
