import { uuidv4 as uuidv4 } from 'uuid';
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

interface ISubmitDonationReqBody {
  donation: Donation;
}

interface IGetProfileDonationsRequestBody{
  profileId: uuidv4
}

export class CampaignController {
  private campaignService: CampaignService;

  constructor(campaignService: CampaignService) {
    this.campaignService = campaignService;
  }

  public async getAllProfiles(req: Request, res: Response<IProfilesResBody>): Promise<void> {
    const profiles = await this.campaignService.getAllProfiles();
    res.json({
      profiles: profiles,
    });
  }

  public async getProfileDonations(
    req: Request,
    res: Response<IDonationsResBody>
  ): Promise<void>{

    const { profile } = req.params;
    const donations = await this.campaignService.getProfileDonations(profile);
    res.json({
      donations: donations,
    });
  }

  submitProfileDonations(
    req: Request,
    res: Response
  ): void{
  
      
  }

  submitCampaignDonations(
    req: Request,
    res: Response
  ): void{
  
  }
}
