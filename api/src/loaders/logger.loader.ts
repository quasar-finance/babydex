import pino from 'pino';

const level = process.env.LOG_LEVEL || 'info';

globalThis.logger = pino({ level, transport: { target: 'pino-pretty', options: { levelFirst: true, color: true, translateTime: 'SYS:HH:MM:ss', ignore: 'hostname,pid' } } });