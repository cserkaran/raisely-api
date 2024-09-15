import { Donation } from './Donation';
import { Profile } from './Profile';

export interface IGetProfileRequestBody {
  profile: string;
}

export interface ICreateProfileRequestBody {
  profile: Profile;
}

export interface ISubmitDonationRequestBody {
  donation: Donation;
}
