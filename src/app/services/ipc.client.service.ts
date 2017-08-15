import { Injectable, NgZone } from '@angular/core';
import * as electron from 'electron';
declare let window: any;

@Injectable()
export class IpcClientService {

  private ipc = window.require('electron').ipcRenderer;

  constructor(
    private zone: NgZone
  ) {
  }

  on(listener: string, cb: Function, updateZone = true) {
    this.ipc.on(listener, (event, arg) => {
      arg = JSON.parse(arg);
      cb(event, arg);
      if (updateZone) {
        this.zone.run(() => { });
      }
    });
  }

  send(method, arg: any = null) {
    this.ipc.send(method, JSON.stringify(arg));
  }

  sendSync(method: string, arg: any = null) {
    return this.ipc.sendSync(method, JSON.stringify(arg));
  }

}
