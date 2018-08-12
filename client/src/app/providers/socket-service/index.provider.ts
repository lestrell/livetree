import { FileDatabase } from './../file-database';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '@env/environment';
import { Logger } from '@app/core';
import { map } from "lodash";
import { INewFactory, IEditReturnFactory, IRefreshData } from '../../../types';

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

        socket.on("new_factory", ({key}: INewFactory) => {
          logger.info("new_factory", key);
          this.database.pushReplaceRootChild({ key });
        });

        socket.on("edit_factory", (data: IEditReturnFactory) => {
          logger.info("edit_factory", data);
          const { key, children } = data;
          this.database.pushReplaceRootChild({ key, children: this.database.getChildren(children) });
        });

        socket.on("refresh_data", (arr: IRefreshData[]) => {
          logger.info("refresh_data", arr);
          const _data = {};
          map(arr, ({key, children}) => _data[key] = children );
          this.database.refreshData(_data);
        });
    });

  }

  emit<T>(event: string, data: T, callback: any) {
    socket.emit(event, data, callback);
  }
}
