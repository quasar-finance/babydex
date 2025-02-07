import { createClient, RedisClientType } from 'redis';

const { REDIS_PW } = process.env;

export const redis: RedisClientType = createClient({
  password: REDIS_PW,
  socket: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT
  }
});
