import { Injectable } from '@angular/core';
import 'reflect-metadata';

@Injectable()
export class IpcService {

    private ipc = require('electron').ipcMain;

    on(listener: string, cb: Function) {
        this.ipc.on(listener, (event, arg) => {
            arg = JSON.parse(arg);
            cb(event, arg);
        });
    }

    send(listener: String, event: any, param: any = null) {
        event.sender.send(listener, JSON.stringify(param));
    }
}