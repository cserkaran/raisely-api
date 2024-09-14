import express from 'express';

import { CampaignController } from './controllers/CampaignController';
import { CampaignRoute } from './routes/CampaignRoutes';
import { CampaignService } from './services/CampaignService';

const campaignService = new CampaignService();
const campaignController = new CampaignController(campaignService);
const campaignRoute = new CampaignRoute(campaignController);

const app = express();

app.use(express.json());
app.use(campaignRoute.createRouter());

export default app;
