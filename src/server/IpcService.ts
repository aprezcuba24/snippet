import { Observable, Observer } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import 'reflect-metadata';
import * as electron from 'electron';

export type IpcInput = {
    event: any,
    arg: any,
}
export type IpcOuput = {
    data?: any,
    error?: any,
}

@Injectable()
export class IpcService {

    private ipc = electron.ipcMain;

    on(listener: string): Observable<IpcInput> {
        return Observable.create((objserver: Observer<IpcInput>) => {
            this.ipc.on(listener, (event, arg) => {
                arg = JSON.parse(arg);
                objserver.next({
                    arg: arg,
                    event: event,
                })
            });
        });
    }

    process(listener: string, executor: (ipc: IpcInput) => Observable<IpcOuput>) {
        this.on(listener)
            .flatMap((ipc: IpcInput) => executor(ipc)
                .map(result => {
                    return {
                        ipc: ipc,
                        result: {
                            data: result,
                        },
                    }
                })
                .catch(err => Observable.of({
                    ipc: ipc,
                    result: {
                        error: err.message,
                    }
                }))
            )
            .subscribe(data => {
                this.send(listener, data.ipc.event, data.result)
            })
        ;
    }

    send(listener: String, event: any, param: any = null) {
        event.sender.send(listener, JSON.stringify(param));
    }
}