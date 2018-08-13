import redis, { RedisClient } from "redis";
import url from "url";
import util from "util";
import { isString, map } from "lodash";

const logger = console;

import * as Bluebird from 'bluebird';
import { parseJSON } from '../../utils/parse-json';
const bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
export interface IRedisClient extends RedisClient {
	setAsync(key: string, value: string): Bluebird<"OK">;
	getAsync(key: string): Bluebird<string>;
	keysAsync(key: string): Bluebird<string[]>;
}

export class RedisService {

	public static _redis: IRedisClient;

	public static init() {
		const { REDISTOGO_URL } = process.env;

		if (REDISTOGO_URL) {
			const rtg = url.parse(REDISTOGO_URL);
			RedisService._redis = redis.createClient(rtg.port, rtg.hostname as any) as any;
			RedisService._redis.auth(rtg.auth.split(":")[1]);
		} else {
			// Development mode
			RedisService._redis = redis.createClient() as any;
			RedisService._redis.flushdb(logger.info);
		}

		// util.promisify(RedisService._redis).bind(RedisService._redis);

	}

	public static set<T>(key: string, obj: T) {
		return RedisService._redis.setAsync(key, isString(obj) ? obj : JSON.stringify(obj)).catch(logger.error);
	}

	public static get(key: string) {
		return RedisService._redis.getAsync(key).then((value) => parseJSON(value) || value).catch(logger.error);
	}

	/**
	 * Since Redis is-memory database, this is shouldn't be bad practice
	 */
	public static getAll(): any {
		return RedisService._redis
			.keysAsync("*")
			.then((data: string[] = []) => Promise.all(map(data, d => this.get(d))) as any)
			.catch(logger.error);
	}
}
