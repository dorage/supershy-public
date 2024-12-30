import { CityModel, SchoolModel } from '@/types/models';
import API from '.';

interface getCitiesArgs {
  query: {
    id: string | '000000';
  };
}

const getCities = (args: getCitiesArgs) =>
  API.get<CityModel[]>({
    pathname: `/v1/cities`,
    args: args,
    authorization: true,
  });

interface getCitiesParentCityIdSchoolsArgs {
  query: {
    id: string;
    type: 'smp' | 'sma' | 'smk';
  };
}
type getCitiesParentCityIdSchoolsResponse = SchoolModel[];

const getCitiesSchools = (args: getCitiesParentCityIdSchoolsArgs) =>
  API.get<getCitiesParentCityIdSchoolsResponse>({
    pathname: `/v1/cities/schools`,
    args: args,
    authorization: true,
  });

const CitiesProvider = { getCities, getCitiesSchools };

export default CitiesProvider;
