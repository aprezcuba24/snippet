import { Observable } from 'rxjs/Rx';
import { IpcService } from '../IpcService';
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
    const Mongod = require('mongod');
    const mongod = new Mongod({
      port: server.mongoPort,
      bin: server.mongod,
      dbpath: server.dbpath,
    });

    return Observable.fromPromise(mongod.open())
      .flatMap(() => Observable.fromPromise(connect(server.db_connection))
        .map(() => true)
      )
    ;
  }
}
