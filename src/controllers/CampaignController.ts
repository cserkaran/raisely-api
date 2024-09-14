import { uuidv4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { Profile } from '../models/Profile';
import { Donation } from '../models/Donation';
import { CampaignService } from '../services/CampaignService';

interface IProfilesResultBody {
  profiles: Array<Profile>;
}

interface IProfileResultBody {
  profile: Profile;
}

interface IDonationResultBody {
  donation: Donation;
}

interface IDonationsResultBody {
  donations: Array<Donation>;
}

interface ISubmitDonationRequestBody {
  donation: Donation;
}

export class CampaignController {
  private campaignService: CampaignService;

  constructor(campaignService: CampaignService) {
    this.campaignService = campaignService;
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
    req: Request<{ profile: uuidv4 }>,
    res: Response<IDonationsResultBody>
  ): Promise<void> {
    const profile = req.params.profile;
    const donations = await this.campaignService.getProfileDonations(profile);
    res.json({
      donations: donations,
    });
  }

  public async submitProfileDonations(
    req: Request<{ profile: uuidv4 }, {}, ISubmitDonationRequestBody>,
    res: Response<IDonationResultBody | { error: string }>
  ): Promise<void> {
    const profile = req.params.profile;
    const profileObj = await this.campaignService.getProfile(profile);
    if (!profileObj) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    
    const donation = req.body.donation;
    donation.profileId = profile;

    const newDonation =
      await this.campaignService.submitProfileDonation(donation);

    res.json({
      donation: newDonation,
    });
  }

  submitCampaignDonations(req: Request, res: Response): void {}
}
