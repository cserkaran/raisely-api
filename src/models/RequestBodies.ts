// Defines the Request bodies to get payload requests in a type safe manner.
import { Donation } from './Donation';
import { Profile } from './Profile';

// Request body to get a profile by id.
export interface IGetProfileRequestBody {
  profile: string;
}

// Request body to create a new profile.
export interface ICreateProfileRequestBody {
  profile: Profile;
}

// Request body to submit a new donation.
export interface ISubmitDonationRequestBody {
  donation: Donation;
}
