export type TestArgs = { name: string };
export const test = async ({ name }: TestArgs) =>
  await new Promise((resolve) =>
    setTimeout(() => {
      console.log(`hello, ${name}`);
      resolve(1);
    }, 2000)
  );
