import redis, { RedisClient, createClient, Callback } from "redis";
import url from "url";
import { isString } from "lodash";

// import { promisify } from "bluebird";
// promisify(redis.RedisClient.prototype.;


export class RedisService {

	public static _redis: RedisClient;

	public static init() {
		const { REDISTOGO_URL } = process.env;

		if (REDISTOGO_URL) {
			const rtg = url.parse(REDISTOGO_URL);
			RedisService._redis = createClient(rtg.port, rtg.hostname as any);
			RedisService._redis.auth(rtg.auth.split(":")[1]);
		} else {
			RedisService._redis = createClient();
		}

	}

	public static set<T>(key: string, obj: T, cb: Callback<"OK">) {
		RedisService._redis.set(key, isString(obj) ? obj : JSON.stringify(obj), cb);
	}

	public static get<T>(key: string, cb: Callback<string>) {
		RedisService._redis.get(key, cb);
	}
}
