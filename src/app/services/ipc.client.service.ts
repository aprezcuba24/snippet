import { Observable, Observer } from 'rxjs/Rx';
import { Injectable, NgZone } from '@angular/core';
declare let window: any;

export type IpcClientData = {
    event: any,
    data: any,
}

@Injectable()
export class IpcClientService {

    private ipc = window.require('electron').ipcRenderer;

    constructor(
        private zone: NgZone
    ) {}

    on(listener: string, keepOpen = false) {
        return Observable.create((observer: Observer<IpcClientData>) => {
            let method = this.ipc.once.bind(this.ipc);
            if (keepOpen) {
                let method = this.ipc.on.bind(this.ipc);
            }
            method(listener, (event, arg) => {
                this.zone.run(() => {
                    arg = JSON.parse(arg);
                    if (arg.error) {
                        observer.error(arg.error);
                    } else {
                        observer.next(arg.data)
                    }
                    if (!keepOpen) {
                        observer.complete();
                    }
                })
            });
        });
    }

    send(message, arg: any = null, keepOpen = false) {
        let observable = Observable.create((observer: Observer<void>) => {
            this.ipc.send(message, JSON.stringify(arg));
            observer.complete();
        });
        return Observable.concat(observable, this.on(message, keepOpen));
    }

    sendSync(method: string, arg: any = null) {
        return this.ipc.sendSync(method, JSON.stringify(arg));
    }

}
