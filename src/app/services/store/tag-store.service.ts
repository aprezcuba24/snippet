/**
 * Servicio para la comunicación  con los procesos relacionado con los tags
 */

import { TagInterface } from '../../domain_types';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { IpcClientService } from '../ipc.client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TagStoreService {

  constructor(
    private ipc: IpcClientService
  ) {
  }

  /**
   * Obtener todos los tags
   * @returns {any}
     */
  get all$(): Observable<any> {
    let all$ = new BehaviorSubject<any>(null); // Creo un BehaviorSubject para evitar varias llamadas al servidor
    this.ipc.send('tag.all')
      .subscribe((data: TagInterface[]) => {
        all$.next(data); // Envío los datos por el canal
      })
      ;
    return all$.filter(data => data != null); // Solo mando mensajes si ya tengo datos
  }
}
