import { createClient, RedisClientType } from "redis";

class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client.on("error", (err) => console.log("Redis Client Error", err));
  }

  async connect() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error("Error connecting to Redis:", error);
    }
  }

  async setCache(key: string, value: any) {
    try {
      await this.client.set(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  }

  async getCache(key: string) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting cache:", error);
      return null;
    }
  }

  async deleteCache(key: string) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error("Error deleting cache:", error);
    }
  }

  async clearCache() {
    try {
      const keys = await this.client.keys("*");
      for (const key of keys) {
        await this.client.del(key);
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  async disconnect() {
    try {
      await this.client.quit();
    } catch (error) {
      console.error("Error disconnecting from Redis:", error);
    }
  }

  async setWithExpiry(key: string, value: any, ttl: number) {
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting cache with expiry:", error);
    }
  }

  async keyExists(key: string): Promise<boolean> {
    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      console.error("Error checking key existence:", error);
      return false;
    }
  }
}

export default RedisService;
