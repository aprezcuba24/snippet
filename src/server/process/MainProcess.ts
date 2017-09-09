/**
 * Clase principal que inicializa todos los servicios, en esto momento solo inicia la base de datos
 */

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
      'init', // Escucho el mensaje init desde el cliente
      this.connectBd$.bind(this) //Respondo con un observable que inicia la base de datos
    );
  }

  connectBd$() {
    const Mongod = require('mongod');
    const mongod = new Mongod({
      port: server.mongoPort,
      bin: server.mongod,
      dbpath: server.dbpath,
    });

    return Observable.fromPromise(mongod.open()) //Inicio la base de datos
      .flatMap(() => Observable.fromPromise(connect(server.db_connection)) // Me conecto a la base de datos
        .map(() => true) // Si todo fue bien le mando true al cliente indicando que ya está conectado
      )
    ;
  }
}
