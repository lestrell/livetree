import { IEditFactory } from '../../types/edit-factory';
import SocketIO from "socket.io";
import * as http from "http";
import { RedisService as redis } from '../redis/index';
import { generateArrayFromRangeAndLimit } from "../../utils/generate-array-from-range-and-limit";
import { INewFactory, IEditReturnFactory } from '../../types';
import { isFunction, merge } from 'lodash';
import * as Bluebird from 'bluebird';

const logger = console;

let me: SocketIOService;
export class SocketIOService {

	private io: SocketIO.Server;

	private onNewFactory = ({key}: INewFactory, callback: any) => {
		logger.info("new_factory", key, callback);

		redis
		.set<INewFactory>(key, {key})
		.then( () => me.io.emit("new_factory", {key}))
		.then( () => isFunction(callback) && callback({key}));

	};

	private onEditFactory = (data: IEditFactory, callback: any) => {
		let removePromise: Bluebird<0|1> = Promise.resolve(0) as any;
		if (data.oldKey !== data.key) {
			removePromise = redis.remove(data.oldKey)
		}
		logger.info("edit_factory", data, callback);
		const children = generateArrayFromRangeAndLimit(data);

		const redisData: IEditReturnFactory = { key: data.key, children };

		const returnData = merge(redisData, { oldKey: data.oldKey });

		(removePromise || Promise.resolve() as any)
		.then( (data: any) => redis.set<IEditReturnFactory>(data.key, redisData) )
		.then( () => me.io.emit("edit_factory", returnData))
		.then( () => isFunction(callback) && callback(returnData));
	};

	// private emitRefreshData = async() => await redis.getAll()

	constructor(http: http.Server) {
		me = this;

		me.io = SocketIO(http);
		redis.init();

		me.io.on("connection", async(socket: SocketIO.Socket) => {
			logger.info("connection");

			// TODO: do authentication before subscribing to the socket events using JWT strategy (middleware)

			socket.emit("refresh_data", await redis.getAll());

			socket.on("disconnect", () => logger.info("user disconnected") );

			socket.on("new_factory", me.onNewFactory);

			socket.on("edit_factory", me.onEditFactory);

		});

	}

}
