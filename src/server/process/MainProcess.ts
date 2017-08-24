import { Observable } from 'rxjs/Rx';
import { IpcInput, IpcOuput, IpcService } from '../IpcService';
import { Injectable } from '@angular/core';
import { connect } from 'camo';
import { server } from '../../environments/server';

@Injectable()
export class MainProcess {

    constructor(
        private ipc: IpcService
    ) {
        this.ipc.process(
            'init',
            this.connectBd$.bind(this)
        );
    }

    connectBd$() {
        return Observable.fromPromise(connect(server.db_connection))
            .take(1)
            .map(() => true)
            ;
    }
}