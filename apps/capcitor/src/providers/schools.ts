import { PollCandidateModel } from '@/types/models';
import API from '.';
import { ESchoolType, EUserGender } from '@/types/enum';

interface getSchoolsArgs {}
type getSchoolsResponse = {
  school: { id: string; name: string; type: ESchoolType };
  students: { id: number; name: string; gender: EUserGender; phone: string }[];
};

const getSchools = (args: getSchoolsArgs) =>
  API.get<getSchoolsResponse>({
    pathname: `/v1.0.1/schools`,
    authorization: true,
    args: args,
  });

const SchoolsProvider = {
  getSchools,
};

export default SchoolsProvider;
