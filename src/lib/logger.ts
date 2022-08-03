import { noop } from '../utils/noop';

const DEFAULT = {
  info: noop,
  error: noop,
};
export const logger = (prefix: string, logging: boolean = true) => {
  if (!logging) return DEFAULT;

  return {
    info: (message: string) => {
      console.log(`${prefix} - ${message}`);
    },
    error: (error: string) => {
      console.error(`${prefix} - ${error}`);
    },
  };
};
