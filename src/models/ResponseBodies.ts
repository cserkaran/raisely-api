import { Donation } from './Donation';
import { Profile } from './Profile';

export interface IProfilesResultBody {
  profiles: Array<Profile>;
}

export interface IProfileResultBody {
  profile: Profile;
}

export interface IDonationResultBody {
  donation: Donation;
}

export interface IDonationsResultBody {
  donations: Array<Donation>;
}

export interface IErrorMessage {
  error: string;
}

export interface IErrorResponse extends IErrorMessage{
  statusCode: number;
}

