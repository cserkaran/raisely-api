// Defines the Response bodies to get responses in a type safe manner.

import { Donation } from './Donation';
import { Profile } from './Profile';

// Result body to Get Multiple Profiles
export interface IProfilesResultBody {
  profiles: Array<Profile>;
}

// Result body to Get a Single Profile
export interface IProfileResultBody {
  profile: Profile;
}

// Result body to Get a Single Donation
export interface IDonationResultBody {
  donation: Donation;
}

// Result body to Get Multiple Donations
export interface IDonationsResultBody {
  donations: Array<Donation>;
}

// Result body for an Error Message
export interface IErrorMessage {
  error: string;
}

// Result body for an Error Response
export interface IErrorResponse extends IErrorMessage {
  statusCode: number;
}
