/**
 * Este servicio sirve como emboltura de "electron.ipcMain" haciendo uso de Observables de RxJs
 */

import {Observable, Observer} from 'rxjs/Rx';
import {Injectable} from '@angular/core';
import 'reflect-metadata';
import * as electron from 'electron';

export type IpcInput = { //Estructura de datos para la entrada de información
  event:any,
  arg:any,
}
export type IpcOuput = { //Estructura de datos para los datos de salida
  data?:any,
  error?:any,
}

@Injectable()
export class IpcService {

  private ipc = electron.ipcMain;

  /**
   * Crea un observable para un listener específico de IPC y el observable nunca se cierra
   * @param listener
   * @returns {any}
   */
  on(listener:string):Observable<IpcInput> {
    return Observable.create((objserver:Observer<IpcInput>) => {
      this.ipc.on(listener, (event, arg) => {
        arg = JSON.parse(arg);
        objserver.next({
          arg: arg,
          event: event,
        })
      });
    });
  }

  /**
   * Hace una conexión entre un listener y el método que lo procesa
   * ver las clases "Process" para ver ejemplos
   * @param listener
   * @param executor
   */
  process(listener:string, executor:(ipc:IpcInput) => Observable<IpcOuput>) {
    this.on(listener) // Crea un observable para el listener
      .flatMap((ipc:IpcInput) => executor(ipc) // LLama al metodo y obtiene el observable de salida
        .map(result => { // Envia en el flujo el ipc que son los datos de entrada y los datos
          return {
            ipc: ipc,
            result: {
              data: result,
            },
          }
        })
        // .catch(err => Observable.of({ // Si hay error lo manda al cliente
        //   ipc: ipc,
        //   result: {
        //     error: err.message,
        //   }
        // }))
      )
      .subscribe(data => { //Finalmente hago el subscribe y envío los datos al cliente.
        this.send(listener, data.ipc.event, data.result)
      })
    ;
  }

  /**
   * Envía un mensaje al cliente
   * @param listener
   * @param event
   * @param param
   */
  send(listener:String, event:any, param:any = null) {
    event.sender.send(listener, JSON.stringify(param));
  }
}
