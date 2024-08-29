import pino from 'pino';

function createLogger() {
  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      }
    },
  });

  return {
    prefix: null,
    setPrefix(prefix: string) {
      this.prefix = prefix;
    },
    info(message: string) {
      logger.info(this.prefix ? `[${this.prefix}] ${message}` : message);
    }
  };
}

const logger = createLogger();

export { logger };