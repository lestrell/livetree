import { FileDatabase } from './../file-database';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '@env/environment';
import { Logger } from '@app/core';

let socket: SocketIOClient.Socket; // SocketIOClient.Socket;

const logger = new Logger("SocketService");

@Injectable()
export class SocketService {

  constructor(private database: FileDatabase) {

  }

  initialize() {
    this.connect();
  }

  connect() {
    socket = io.connect(environment.socketHost) as any;

    socket.on("connect", () => {
      logger.info("connected");
    });

    socket.on("new_factory", (data: any) => {
      logger.info("new_factory", data);
    });

    socket.on("edit_factory", (data: any) => {
      logger.info("edit_factory", data);
    });

    socket.on("refresh_data", (data: any) => {
      logger.info("refresh_data", data);
      this.database.refreshData(data);
    });

  }

  emit<T>(event: string, data: T, callback: any) {
    socket.emit(event, data, callback);
  }
}
