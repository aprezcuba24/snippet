import { Observable, Observer } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import 'reflect-metadata';
import * as electron from 'electron';

export type IpcData = {
    event: any,
    arg: any,
}

@Injectable()
export class IpcService {

    private ipc = electron.ipcMain;

    on(listener: string) {
        return Observable.create((objserver: Observer<IpcData>) => {
            this.ipc.on(listener, (event, arg) => {
                arg = JSON.parse(arg);
                objserver.next({
                    arg: arg,
                    event: event,
                })
            });
        });
    }

    send(listener: String, event: any, param: any = null) {
        event.sender.send(listener, JSON.stringify(param));
    }
}