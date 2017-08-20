import { Observable } from 'rxjs/Rx';
import { IpcService, IpcData } from '../IpcService';
import { Injectable } from '@angular/core';
import { connect } from 'camo';
import { server } from '../../environments/server';

@Injectable()
export class MainProcess {

    constructor(
        private ipc: IpcService
    ) {
        this.ipc.on('init').take(1).subscribe(this.onInit.bind(this));
    }

    onInit(data: IpcData) {
        this.connectBd().subscribe(
            () => {
                this.ipc.send('init', data.event, {
                    data: true,
                    error: null,
                });
            },
            err => {
                this.ipc.send('init', data.event, {
                    data: null,
                    error: err.message,
                });
            }
        )
    }

    connectBd() {
        return Observable.fromPromise(connect(server.db_connection));
    }
}