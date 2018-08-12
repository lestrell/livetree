import { IEditFactory } from '../../types/edit-factory';
import SocketIO from "socket.io";
import * as http from "http";
import { RedisService as redis } from '../redis/index';
import { generateArrayFromRangeAndLimit } from "../../utils/generate-array-from-range-and-limit";

const logger = console;
export class SocketIOService {

	public static create(http: http.Server) {

		const io: SocketIO.Server = SocketIO(http);
		redis.init();

		io.on("connection", async (socket: SocketIO.Socket) => {
			logger.info("connection");

			// redis.getAll().then( (a: any) => {
			// 	logger.log("redis", a);
			// })
			// console.log(`await redis.getAll()`, await redis.getAll());
			socket.emit("refresh_data", await redis.getAll());
			// socket.emit("refresh_data", { message: "Hi :)" });

			// tslint:disable-next-line:only-arrow-functions
			socket.on("disconnect", function () {
				logger.info("user disconnected");
			});

			socket.on("new_factory", ({key}: { key: string }, callback: any) => {
				logger.info("new_factory", key, callback);
				redis
				.set(key, {key})
				.then( () => io.emit("new_factory", {key}))
				.then( () => callback({key}));

			});

			socket.on("edit_factory", (data: IEditFactory, callback: any) => {
				logger.info("edit_factory", data, callback);
				const children = generateArrayFromRangeAndLimit(data);

				const _data = { key: data.key, children };
				redis
				.set(data.key, _data)
				.then( () => io.emit("edit_factory", _data))
				.then( () => callback(_data));
			});

		});

	}
}
