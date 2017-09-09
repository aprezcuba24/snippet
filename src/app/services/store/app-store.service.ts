/**
 * Servicio que se conecta con los procesos generales del servidor
 */

import {BehaviorSubject} from 'rxjs/Rx';
import {IpcClientService} from './../ipc.client.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AppStoreService {

  private _backendReady$ = new BehaviorSubject(false); // Informa si el servidor ya está listo
  private _pageReady$ = new BehaviorSubject(false); // Bandera para indicar si la página está lista

  constructor(private ipc:IpcClientService) {
    this.ipc.send('init') //Manda el mensaje para que se inicie el servidor
      .filter(data => data == true)  // El servidor está listo si la respuesta es true
      .subscribe(() => {
        this._backendReady$.next(true); // Pongo la bandera de servidor listo en true, para que la interfaz se muestre
      })
    ;
  }

  get backendReady$() {
    return this._backendReady$.filter(ready => ready == true); // Solo manda mensajes si el servidor está listo
  }

  setPageReady(ready) { // Método para hacer el cambio de la bandera de página lista
    this._pageReady$.next(ready);
  }

  get pageReady$() { // Devolver el observable
    return this._pageReady$.distinctUntilChanged(); // Solo se manda un nuevo valor por el canal si hay cambio en la  bandera
  }
}
