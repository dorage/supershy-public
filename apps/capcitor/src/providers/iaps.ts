import { InAppProductModel } from '@/types/models';
import API from '.';

interface getIapsArgs {
  query: {
    platform: 'web' | 'ios' | 'android';
  };
}

const getIaps = (args: getIapsArgs) =>
  API.get<InAppProductModel[]>({
    pathname: '/v1/iaps',
    args,
    authorization: true,
  });

const IapsProvider = { getIaps };

export default IapsProvider;
