import { queue } from '../../src/lib/queue';

describe('queue with logging disabled', () => {
  const testQueue = queue({
    name: 'test-log-disabled',
    handler: () => {},
    options: {
      logging: false,
    },
  });
});
