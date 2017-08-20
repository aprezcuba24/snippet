import { Observable, Observer } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
// import * as electron from 'electron';
declare let window: any;
declare let electron: any;

export type IpcClientData = {
  event: any,
  data: any,
}

@Injectable()
export class IpcClientService {

  // private ipc = window.require('electron').ipcRenderer;
  private ipc = electron.ipcRenderer;

  on(listener: string) {
    return Observable.create((observer: Observer<IpcClientData>) => {
      // observer.next({
      //   event: '',
      //   data: '',
      // });
      this.ipc.on(listener, (event, arg) => {
        arg = JSON.parse(arg);
        if (arg.error) {
          observer.error(arg.error);
        } else {
          observer.next({
            event: event,
            data: arg.data,
          })
        }
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
