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

export interface IErrorResponse {
  statusCode?: number;
  error: string;
}
