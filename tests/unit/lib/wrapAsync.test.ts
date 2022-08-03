import { wrapAsyncFactory } from '../../../src/lib/wrapAsync';

const makeSUT = (fn: () => void) => {
  const updateJobMockFn = jest.fn(() => {});
  const nextMockFn = jest.fn(() => {});
  const handler = jest.fn(fn);

  const wrapAsync = wrapAsyncFactory(updateJobMockFn, nextMockFn);

  return { updateJobMockFn, nextMockFn, wrapAsync, handler };
};

describe('wrapAsync', () => {
  it('success case', async () => {
    const SUT = makeSUT(() => {});

    await SUT.wrapAsync('test', SUT.handler);

    setImmediate(() => {
      expect(SUT.updateJobMockFn).toHaveBeenCalledTimes(2);
      expect(SUT.handler).toHaveBeenCalledTimes(1);
      expect(SUT.nextMockFn).toHaveBeenCalledTimes(1);
    });
  });

  it('error case', async () => {
    const SUT = makeSUT(() => {});

    setImmediate(() => {
      expect(SUT.handler).toHaveBeenCalledTimes(1);
      expect(SUT.nextMockFn).toHaveBeenCalledTimes(1);
    });
  });
});
