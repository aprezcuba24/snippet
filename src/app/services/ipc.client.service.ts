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
    private zone: NgZone,
  ) {}

  on(listener: string) {
    return Observable.create((observer: Observer<IpcClientData>) => {
      this.ipc.on(listener, (event, arg) => {
        this.zone.run(() => {
          arg = JSON.parse(arg);
          if (arg.error) {
            observer.error(arg.error);
          } else {
            observer.next(arg.data)
          }
        })
      });
    });
  }

  send(message, arg: any = null) {
    let observable = Observable.create((observer: Observer<void>) => {
      this.ipc.send(message, JSON.stringify(arg));
      observer.complete();
    })
    return Observable.concat(observable, this.on(message));
  }

  sendSync(method: string, arg: any = null) {
    return this.ipc.sendSync(method, JSON.stringify(arg));
  }

}
