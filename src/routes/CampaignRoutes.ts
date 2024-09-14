import { Router } from 'express';
import { CampaignController } from '../controllers/CampaignController';

export class CampaignRoute {
  private campaignController: CampaignController;

  constructor(campaignController: CampaignController) {
    this.campaignController = campaignController;
  }

  createRouter(): Router {
    const router = Router();

    router.get('/', (req, res) => {
      res.send('Welcome to the Raisely API');
    });

    router.get(
      '/profiles',
      this.campaignController.getAllProfiles.bind(this.campaignController)
    );

    router.get("/profiles/:profile/donations",
      this.campaignController.getProfileDonations.bind(this.campaignController)
    );

    router.post("/profiles/:profile/donations",
      this.campaignController.submitProfileDonations.bind(this.campaignController)
    );

    router.post("/donations",
      this.campaignController.submitCampaignDonations.bind(this.campaignController)
    );

    return router;
  }
}
