/**
 * Servicio para la comunicación con el proceso relacionado con los snippets
 */

import {IpcClientService} from './../ipc.client.service';
import {Injectable} from '@angular/core';
import {SnippetInterface, TagInterface} from "../../domain_types";
import {BehaviorSubject, Observable} from "rxjs/Rx";

@Injectable()
export class SnippetStoreService {

  private _tagsFilters$ = new BehaviorSubject<TagInterface[]>([]); // Para almacenar los tags que están en los filtros
  private _lastViews$ = new BehaviorSubject<SnippetInterface[]>([]); // Para trasmitir los últimos snippets vistos
  private _lastViews:SnippetInterface[] = []; // Almacena los últimos 10 snippets vistos
  static readonly CANT_LAST_VIEW:number = 10; // Solo voy a mostrar en el menú 10 snippets, los últimos vistos

  constructor(private ipc:IpcClientService) {
  }

  getMoreUsed$(data) {
    return this.ipc.send('snippet.more_used', data); // Envía el mensaje para obtener los  snippets más utilizados
  }

  newest$(data) {
    return this.ipc.send('snippet.newest', data); // Obtiene los snippets ordenados, los más nuevos primero
  }

  search$(data) {
    return this.tagsFilters$ // Observo todos los cambios en los filtros de tags
      .map(tags => {
        return Object.assign(data, { // Armo la consulta que se debe enviar al servidor
          tags: tags,
        })
      })
      .flatMap(data => this.ipc.send('snippet.search', data)) // Cambio el flujo con la respuesta recivida desde el servidor
      ;
  }

  get lastViews$() { // Devuelvo el observable con los últimos snippets vistos
    return this._lastViews$;
  }

  /**
   * Método para adicionar un nuevo snippet como visto
   * @param snippet
     */
  private addLastView(snippet:SnippetInterface) {
    Observable.concat( // Concateno un flujo que tiene el último visto con los que ya estaban almacenados
      Observable.of(snippet), // Creo un flujo que solo tiene el último snippet recibido
      Observable.from(this._lastViews) // Creo un flujo con todos los snippets que ya tenía almacenado
        .filter((item:SnippetInterface) => item._id != snippet._id) // si el último snippet estaba, lo elimino, ahora va a estar de primero
        .take(SnippetStoreService.CANT_LAST_VIEW - 1) // // Con esto evito tener más de 10 snippets en la lista
    )
      .toArray() // Agrupo todos los snippets en un array
      .subscribe(items => {
        this._lastViews = items; // Pongo los snippets resultante en la propiedad otra vez
        this._lastViews$.next(this._lastViews); // Envío los snippets en el canal
      })
    ;
  }

  /**
   * Obtener un snippet dado el id
   * @param id
   * @param increment_view , Si es verdadero incrementa la cantidad de visitas del snippet
   * @returns {any}
     */
  get$(id, increment_view = false) {
    let entity$ = new BehaviorSubject(null); // Creo un BehaviorSubject para evitar hacer muchas llamadas  al servidor
    this.ipc.send('snippet.get', { // Envía el mensaje con los datos
      id: id,
      increment_view: increment_view,
    }).subscribe((entity:SnippetInterface) => {
      entity$.next(entity); // envío la entidad por el canal
      if (increment_view) {// Si hay que incrementar las vistas es porque estoy en la vista de detail
        this.addLastView(entity); // Pongo el snippet como el último visto
      }
    });
    return entity$.filter(entity => entity != null); // Solo envío un mensaje por el observable si tengo ya una entidad
  }

  /**
   * Para salvar o crear una entidad
   * @param entity
   * @returns {any}
     */
  save$(entity:SnippetInterface) {
    if (entity._id) {
      return this.ipc.send('snippet.edit', entity);
    }
    return this.ipc.send('snippet.create', entity);
  }

  /**
   * Devuelve los tags que están en el filtro
   * @returns {BehaviorSubject<TagInterface[]>}
     */
  get tagsFilters$() {
    return this._tagsFilters$;
  }

  /**
   * Pone un nuevo tag en el filtro
   * @param tags
     */
  set tagsFilter$(tags) {
    tags = tags || [];
    this._tagsFilters$.next(tags);
  }
}
