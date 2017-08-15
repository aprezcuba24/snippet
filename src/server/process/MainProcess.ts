import { IpcService } from '../IpcService';
import { Injectable } from '@angular/core';

@Injectable()
export class MainProcess {

    constructor(
        private ipc: IpcService
    ) {
        ipc.on('init', this.onInit.bind(this));
    }

    onInit(event, arg) {
        this.ipc.send('ready', event, {
            value: 'para ver'
        });
    }
}