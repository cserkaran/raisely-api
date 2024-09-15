import { Router } from 'express';
import { CampaignController } from '../controllers/CampaignController';

// Defines the routes for the app.
export class CampaignRoute {
  private campaignController: CampaignController;

  // Class constructor
  constructor(campaignController: CampaignController) {
    this.campaignController = campaignController;
  }

  //Create the router defining the routes for the app.
  createRouter(): Router {
    const router = Router();

    // Generic app route.
    router.get('/', (req, res) => {
      res.send('Welcome to the Raisely API');
    });

    // Route to Get All Profiles.
    router.get(
      '/profiles',
      this.campaignController.getAllProfiles.bind(this.campaignController)
    );

    // Route Create a Profile.
    router.post(
      '/profiles',
      this.campaignController.createProfile.bind(this.campaignController)
    );

    // Route to Get a given Profile ID's donations
    router.get(
      '/profiles/:profile/donations',
      this.campaignController.getProfileDonations.bind(this.campaignController)
    );

    // Route to Submit a new donation to the profile with the given ID
    router.post(
      '/profiles/:profile/donations',
      this.campaignController.submitProfileDonation.bind(
        this.campaignController
      )
    );

    // Route to Submit a new donation to the campaign(root profile)
    router.post(
      '/donations',
      this.campaignController.submitCampaignDonation.bind(
        this.campaignController
      )
    );

    return router;
  }
}
