import { Donation } from './Donation';
import { Profile } from './Profile';
import { uuidv4 as uuidv4 } from 'uuid';

export interface IGetProfileRequestBody {
  profile: uuidv4;
}

export interface ICreateProfileRequestBody {
  profile: Profile;
}

export interface ISubmitDonationRequestBody {
  donation: Donation;
}
