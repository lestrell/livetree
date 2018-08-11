import SocketIO from "socket.io";
import * as http from "http";
import { RedisService as redis } from '../redis/index';

const logger = console;
export class SocketIOService {

  public static create(http: http.Server) {

	const io: SocketIO.Server = SocketIO(http);
	redis.init();

	redis.set("angular", {angular: [0, 1, 2, 3, 4, "Lucas"]}, () => {})

    io.on("connection", (socket: SocketIO.Socket) => {
      logger.info("connection");

	//   redis.get("refresh_data", () => {

	//   })
      socket.emit("refresh_data", {angular: [0, 1, 2, 3, 4, "Lucas"]});

      // tslint:disable-next-line:only-arrow-functions
      socket.on("disconnect", function () {
        logger.info("user disconnected");
      });

      socket.on("new_factory", (data: { key: string, children: number[] }, callback: any) => {
		logger.info("new_factory", data, callback);
		redis.set(data.key, data, callback);
		socket.emit("refresh_data", {angular: [0, 1, 2, 3, 4, "Lucas"]});

      });

      socket.on("edit_factory", (data: any, callback: any) => {
		logger.info("edit_factory", data, callback);
		redis.set(data.key, data.children, callback);
      });

    });

  }
}
