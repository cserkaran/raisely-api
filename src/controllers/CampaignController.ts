import { uuidv4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { CampaignService } from '../services/CampaignService';
import {
  IDonationResultBody,
  IDonationsResultBody,
  IErrorResponse,
  IProfileResultBody,
  IProfilesResultBody,
} from '../models/ResponseBodies';
import {
  ICreateProfileRequestBody,
  IGetProfileRequestBody,
  ISubmitDonationRequestBody,
} from '../models/RequestBodies';

export class CampaignController {
  private campaignService: CampaignService;

  constructor(campaignService: CampaignService) {
    this.campaignService = campaignService;
  }

  public async createCampaignProfile(
    req: Request<{}, {}, ICreateProfileRequestBody>,
    res: Response<IProfileResultBody>
  ): Promise<void> {
    const profileId = req.body.profile;
    await this.campaignService.createCampaignProfile(profileId);
  }

  public async createIndividualProfile(
    req: Request<IGetProfileRequestBody, {}, ICreateProfileRequestBody>,
    res: Response<IProfileResultBody | IErrorResponse>
  ): Promise<void> {
    const parentId = req.params.profile;
    const profile = req.body.profile;
    await this.campaignService.createIndividualProfile(parentId, profile);
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
    const profile = req.params.profile;
    const donations = await this.campaignService.getProfileDonations(profile);
    res.json({
      donations: donations,
    });
  }

  public async submitProfileDonations(
    req: Request<IGetProfileRequestBody, {}, ISubmitDonationRequestBody>,
    res: Response<IDonationResultBody | IErrorResponse>
  ): Promise<void> {
    const profile = req.params.profile;
    const donation = req.body.donation;
    const result = await this.campaignService.submitProfileDonation(
      profile,
      donation
    );
    if (this.isErrorReponse(result)) {
      res.status(result.statusCode).json({ error: result.error });
    } else {
      res.json({
        donation: result,
      });
    }
  }

  submitCampaignDonations(req: Request, res: Response): void {}

  isErrorReponse(obj: any): obj is IErrorResponse {
    return 'error' in obj && 'statusCode' in obj;
  }
}
