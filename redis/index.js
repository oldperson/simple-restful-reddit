// This is a temporary fix  for  batch.exec() and multi.exec() unpromisify problem.
// TODO: Update and user aysnc-redis package if this issue sovled https://github.com/moaxaca/async-redis/issues/10
const redis = require('./asyncRedis');

const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;

const client = redis.createClient({ host, port });

client.on('ready', () => {
  // eslint-disable-next-line no-console
  console.log('Redis connection established');
});

module.exports = client;
