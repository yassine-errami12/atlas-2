const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const colors = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m',
};

const log = (level: LogLevel, message: string, data?: unknown) => {
  if (levels[level] >= levels[LOG_LEVEL as LogLevel]) {
    const timestamp = new Date().toISOString();
    const color = colors[level];
    const reset = colors.reset;

    if (data) {
      console.log(`${color}[${timestamp}] ${level.toUpperCase()}: ${message}${reset}`, data);
    } else {
      console.log(`${color}[${timestamp}] ${level.toUpperCase()}: ${message}${reset}`);
    }
  }
};

export const logger = {
  debug: (message: string, data?: unknown) => log('debug', message, data),
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
};
