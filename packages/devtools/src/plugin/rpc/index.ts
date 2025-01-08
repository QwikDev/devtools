import { ServerFunctions } from '../../kit/types';
import { getAssetsFunctions } from '../assets';
import { ServerContext } from '../types';
import { getRouteFunctions } from '../routes';
import { getNpmFunctions } from '../npm';

export function getServerFunctions(ctx: ServerContext): ServerFunctions {
  return {
    healthCheck: () => true,
    ...getAssetsFunctions(ctx),
    ...getRouteFunctions(ctx),
    ...getNpmFunctions(ctx),
  };
}
