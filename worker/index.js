const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

// This is intentionally a slow solution to justify using Redis.
// Look up Fibonacci recursive solution.
function fib(index) {
  if (index < 2) {
    return 1;
  }

  return fib(index - 1) + fib(index - 2);
}

// Each time a subscribed event is received,
// set the fib value as a key:value pair on the values object.
sub.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)));
});

// Subscribing to the Redis insert event.
sub.subscribe("insert");
