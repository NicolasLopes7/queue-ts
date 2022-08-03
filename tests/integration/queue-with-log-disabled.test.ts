import { queue } from '../../src/lib/queue';
import { TestQueueJobArgs } from './common';

describe('queue with logging disabled', () => {
  const testQueue = queue<TestQueueJobArgs>({
    name: 'test-log-disabled',
    handler: () => {},
    options: {
      logging: false,
    },
  });

  const consoleLogMock = jest.spyOn(global.console, 'log').mockImplementation();

  it('should not log anything when a new job is added', () => {
    testQueue.createJob({ name: 'nicolas' });

    expect(consoleLogMock).not.toHaveBeenCalled();

    consoleLogMock.mockRestore();
  });
});
