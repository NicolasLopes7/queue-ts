export const logger = (prefix: string) => {
  return {
    info: (message: string) => {
      // console.log(`${prefix} - ${message}`);
    },
    error: (error: string) => {
      // console.error(`${prefix} - ${error}`);
    },
  };
};
