import { Request, Response } from 'express';
import { Profile } from '../models/Profile';
import { Donation } from '../models/Donation';
import { CampaignService } from '../services/CampaignService';

interface IProfilesResBody {
  profiles: Array<Profile>;
}

interface IDonationsResBody {
  donations: Array<Donation>;
}

interface IDonationReqBody {
  donation: Donation;
}

export class CampaignController {
  private campaignService: CampaignService;

  constructor(campaignService: CampaignService) {
    this.campaignService = campaignService;
  }

  getAllProfiles(req: Request, res: Response<IProfilesResBody>): void {
    const profiles = this.campaignService.getAllProfiles();
    res.json({
      profiles: profiles,
    });
  }
}
