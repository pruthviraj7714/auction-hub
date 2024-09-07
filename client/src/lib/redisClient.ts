import Redis from "ioredis";
import { saveBidToDatabase } from "./helper";

const redisClient = new Redis(process.env.REDIS_URL as string);

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});


redisClient.on("ready", () => {
  console.log("Redis client is ready and connected.");
});


export default redisClient;
