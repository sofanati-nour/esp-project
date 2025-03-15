import { Redis } from "@upstash/redis";

// Initialize Redis
const redis = Redis.fromEnv();

redis.set("mode", 1);
redis.set("acin", 220);
redis.set("acout", 220);
redis.set("steps", 16);
redis.set("load", 100);
redis.set("protection", 2);
