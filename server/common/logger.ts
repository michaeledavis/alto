import pino from 'pino';

const log = pino({
  name: process.env.APP_ID || 'test-alto',
  level: process.env.LOG_LEVEL || 'debug',
});

export default log;
