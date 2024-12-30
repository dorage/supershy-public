import { EPollGender, ESchoolType, EUserGender } from './enum';

export interface SimpleUserModel {
  id: number;
  name: string | null;
}

export interface VoterModel {
  id: number;
  name: string;
  gender: EUserGender;
}

export interface UserModel {
  id: number;
  name: string | null;
  grade: string | null;
  gender: EUserGender | null;
  created_at: string;
  coin: number;
  vip: {
    create: boolean;
    join: boolean;
  };
  phone: string | null;
  school_group_id: string;
}

export interface PollModel {
  id: number;
  question: string;
  gender: EPollGender;
}

export interface SimplePollAnswerModle {
  id: string;
  poll: PollModel;
}

export interface PollAnswerModel {
  id: string;
  poll: PollModel;
}

export type PollAnswerResultModel = {
  id: string;
  is_checked: boolean;
  poll: PollModel;
  winner: PollCandidateModel;
  voter: PollVoterModel | null | undefined;
  candidates: PollCandidateModel[];
};

export interface PollCandidateModel {
  id?: number;
  name: string;
  gender?: EUserGender;
  phone: string;
}

export interface WinnerModel {
  id: number;
  last_name: string;
  first_name: string;
  nickname: string;
  avatar_url: string | null;
}

export interface PollDetailModel {
  id: string;
  candidates: PollCandidateModel[];
  poll: PollModel;
  winner: WinnerModel;
  updated_at: string;
}

export interface PollVoterModel {
  name: string;
  gender: EUserGender;
}

export interface InAppProductModel {
  id: string;
  platform: 'android' | 'ios';
  type: 'subscription' | 'consumable';
  is_enabled: boolean;
}

export interface NotificationModel {
  id: string;
  user_id: string;
  content: { type: string; target: string; content: string };
  is_checked: boolean;
  created_at: string;
}

export interface CityModel {
  id: string;
  name: string;
}

export interface SchoolModel {
  nspn: string;
  name: string;
  type: ESchoolType;
  location: string[];
}
