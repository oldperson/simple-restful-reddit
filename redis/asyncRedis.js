/**
 * This is a temporary fix  for  batch.exec() and multi.exec() unpromisify problem.
 * TODO: Update and user async-redis package if this issue sovled https://github.com/moaxaca/async-redis/issues/10
 */

const redis = require('redis');
const commands = require('redis-commands').list;
const objectDecorator = require('async-redis/src/object-decorator');

const AsyncRedis = function (args) {
  const client = Array.isArray(args) ? redis.createClient(...args) : redis.createClient(args);
  return AsyncRedis.decorate(client);
};

AsyncRedis.createClient = (...args) => new AsyncRedis(args);

// this is the set of commands to NOT promisify
const commandsToSkipSet = new Set(['multi']);
// this is the set of commands to promisify
const commandSet = new Set(commands.filter(c => !commandsToSkipSet.has(c)));
// this is the set of commands that return a Multi
const queueCommandSet = new Set(['batch', 'multi']);
// this is the set of Multi commands to promisify
const multiCommandSet = new Set(['exec', 'exec_atomic']);

const promisify = function (object, method) {
  return (...args) => new Promise((resolve, reject) => {
    args.push((error, ...results) => {
      if (error) {
        reject(error, ...results);
      } else {
        resolve(...results);
      }
    });
    method.apply(object, args);
  });
};

AsyncRedis.decorate = redisClient => objectDecorator(redisClient, (name, method) => {
  if (commandSet.has(name)) {
    return promisify(redisClient, method);
  } if (queueCommandSet.has(name)) {
    return (...args) => {
      // Decorate the Multi object
      const multi = method.apply(redisClient, args);
      return objectDecorator(multi, (multiName, multiMethod) => {
        if (multiCommandSet.has(multiName)) {
          return promisify(multi, multiMethod);
        }
        return multiMethod;
      });
    };
  }
  return method;
});

module.exports = AsyncRedis;
