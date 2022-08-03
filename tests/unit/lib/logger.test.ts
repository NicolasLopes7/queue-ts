import { logger as loggerFactory } from '../../../src/lib/logger';

describe('logger', () => {
  const logger = loggerFactory('test');

  describe('factory', () => {
    it('should create an "info" method', () => {
      expect(logger.info).toBeInstanceOf(Function);
    });

    it('should create an "error" method', () => {
      expect(logger.error).toBeInstanceOf(Function);
    });
  });

  describe('prefix pattern', () => {
    it('should call the console log on "info" with the right prefix', () => {
      const consoleLogMock = jest
        .spyOn(global.console, 'log')
        .mockImplementation();

      logger.info('test');

      expect(consoleLogMock).toHaveBeenLastCalledWith('test - test');
      consoleLogMock.mockRestore();
    });
    it('should call the console log on "error" with the right prefix', () => {
      const consoleErrorMock = jest
      .spyOn(global.console, 'error')
      .mockImplementation();

    logger.error('error');

    expect(consoleErrorMock).toHaveBeenLastCalledWith('test - error');
    consoleErrorMock.mockRestore();
    });
  });
});
