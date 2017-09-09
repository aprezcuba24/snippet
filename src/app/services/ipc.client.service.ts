/**
 * clase que sirve de intermediaria para la comunicación con el servidor
 * Implementando todo el proceso con observables de RxJs
 */

import {Observable, Observer} from 'rxjs/Rx';
import {Injectable, NgZone} from '@angular/core';
declare let window:any;

export type IpcClientData = {
  event:any,
  data:any,
}

@Injectable()
export class IpcClientService {

  private ipc = window.require('electron').ipcRenderer;

  constructor(private zone:NgZone) {
  }

  /**
   * Crea una conexión con los mensajes que vienen desde el servidor
   * @param listener, mensajes que se quieren escuchar
   * @param keepOpen, Si es verdadero se debe mantener el canal de comunicación abierto
   * @returns {any}
     */
  on(listener:string, keepOpen = false) {
    return Observable.create((observer:Observer<IpcClientData>) => { // Crea un observable
      let method = this.ipc.once.bind(this.ipc); // Por defecto solo se va a esperar un solo dato
      if (keepOpen) { // Si hay que mantener la conexión abierta, cambio el método de conexión con ipc
        method = this.ipc.on.bind(this.ipc);
      }
      method(listener, (event, arg) => {
        this.zone.run(() => { // Utilizo zone para que angular actualice la interfaz
          arg = JSON.parse(arg);
          if (arg.error) { // Si hay error, lo transmito por el canal
            observer.error(arg.error);
          } else { // Envío los datos por el canal
            observer.next(arg.data)
          }
          if (!keepOpen) { // Si la conexión no hay  que mantenerla abierta cierro el canal
            observer.complete();
          }
        })
      });
    });
  }

  /**
   * Método que conecta con un ciclo completo el mensaje desde el cliente con la respuesta del servidor
   * @param message
   * @param arg
   * @param keepOpen
   * @returns {any}
     */
  send(message, arg:any = null, keepOpen = false) {
    let observable = Observable.create((observer:Observer<void>) => {
      this.ipc.send(message, JSON.stringify(arg));
      observer.complete();
    });
    return Observable.concat(observable, this.on(message, keepOpen));
  }

  /**
   * Este método no se ha utilizado, con el método "send" se solucionan todos los casos.
   * @param method
   * @param arg
   * @returns {any}
     */
  sendSync(method:string, arg:any = null) {
    return this.ipc.sendSync(method, JSON.stringify(arg));
  }

}
