import { wrapAsyncFactory } from '../../../src/lib/wrapAsync';

const noop = () => {};
describe('wrapAsync', () => {
  it('should call callbacks', async () => {
    const updateJobMockFn = jest.fn(noop);
    const nextMockFn = jest.fn(noop);
    const handler = jest.fn(noop);

    const wrapAsync = wrapAsyncFactory(updateJobMockFn, nextMockFn);

    wrapAsync('test', handler);

    setImmediate(() => {
      expect(updateJobMockFn).toHaveBeenCalledTimes(2);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(nextMockFn).toHaveBeenCalledTimes(1);
    });
  });
});
