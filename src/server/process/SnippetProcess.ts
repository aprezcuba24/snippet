/**
 * Proceso que gestiona los Snippets
 */

import {Snippet} from './../domain/snippet';
import {IpcInput, IpcService} from './../IpcService';
import {Observable} from 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {TagProcess} from "./TagProcess";
import {SnippetInterface, TagInterface} from "../../app/domain_types";
import * as MongoDb from 'mongodb';

@Injectable()
export class SnippetProcess {
  constructor(private ipc:IpcService,
              private tagProcess:TagProcess) {
    // Hago la conexión de todos los procesos
    this.ipc.process('snippet.create', this.create$.bind(this));
    this.ipc.process('snippet.more_used', this.moreUsed$.bind(this));
    this.ipc.process('snippet.newest', this.newest$.bind(this));
    this.ipc.process('snippet.get', this.get$.bind(this));
    this.ipc.process('snippet.edit', this.edit$.bind(this));
    this.ipc.process('snippet.search', this.search$.bind(this));
  }

  /**
   * Crea un nuevo snippet
   * @param data
   * @returns {any}
     */
  create$(data:IpcInput) {
    let snippet = Snippet.create(data.arg); // Creo un nuevo objeto
    // Al método "getOrCreated$" llegan los tags nuevos o ya creados
    // Devolviendo ya objetos tags ya almacenados en base de datos para poder hacer la relación
    return this.tagProcess.getOrCreated$(data.arg.tags)
      .flatMap(tags => {
        snippet.tags = tags; //Le pongo los tags a al snippet
        return Observable.fromPromise(snippet.save()); //Devuelvo un observable que salva el objeto
      })
      ;
  }

  /**
   * Método comodin para paginar los datos
   * @param data
   * @param query
   * @param options
   * @returns {any}
     */
  paginate(data:IpcInput, query = {}, options = {}) {
    options = Object.assign(options, {
      skip: (data.arg.page - 1) * data.arg.itemsPerPage,
      limit: data.arg.itemsPerPage,
    });
    let count$ = Observable.fromPromise(Snippet.count(query, options)); //Observable para hacer el conteo de los datos
    let items$ = Observable.fromPromise(Snippet.find(query, options)); // Observable que hace la búsqueda
    return Observable.combineLatest(count$, items$) // Espera que los dos observables tenga ya datos
      .map(result => { // Arma la respuesta que debe ser enviada al cliente
        return {
          total: result[0],
          items: result[1],
        }
      })
      ;
  }

  /**
   * Devuelve los snippet ordenados por fecha de creado, los nuevos primero
   * @param data
   * @returns {any}
     */
  newest$(data:IpcInput) {
    return this.paginate(data, {}, {
      sort: '-createdAt',
    });
  }

  /**
   * Devuelve los snippet según la cantida de visitas
   * Los más vistos son los más usados.
   * @param data
   * @returns {any}
     */
  moreUsed$(data:IpcInput) {
    return this.paginate(data, {}, {
      sort: '-cantViews',
    });
  }

  /**
   * Buscador pot tags
   * @param data
   * @returns {any}
     */
  search$(data:IpcInput) {
    return Observable.from(data.arg.tags) // Hago un observable que devuelve cada tag por separado
      .map((item:TagInterface) => item._id) // Me quedo solo con el id
      .map(id => new MongoDb.ObjectId(id)) // id es un string y lo convierto a un id de mongo
      .toArray() // Agrupo todos los  id de nuevo en un array
      .flatMap(ids => this.paginate(data, { // Busco todos los snippet que tenga ese tag y lo ordeno según la cantidad de visitas
        tags: {$in: ids}
      }, {
        sort: '-cantViews',
      }))
      ;
  }

  /**
   * Buscar un snippet según su id
   * @param data
   * @returns {any}
     */
  get$(data:IpcInput) {
    return Observable.fromPromise(Snippet.findOne({ //Busco el snippet según el id
      _id: data.arg.id
    }))
      .flatMap((item:SnippetInterface) => {
        if (!data.arg.increment_view) {
          return Observable.of(item); // Si no tengo que incrementar la cantidad de visitas, simplemente lo devuelvo
        }
        item.cantViews++;
        return Observable.fromPromise(item.save()); //Incremento la cantidad de visitas y lo devuelvo
      })
      ;
  }

  /**
   * Para editar un snippet
   * @param data
   * @returns {any}
     */
  edit$(data:IpcInput) {
    let entity$ = Observable.fromPromise(Snippet.findOne({ //Observable que busca el snippet
      _id: data.arg._id
    }));
    let tags$ = this.tagProcess.getOrCreated$(data.arg.tags); // Crea los tags nuevos y devuelve los objetos ya salvados
    return Observable.combineLatest(entity$, tags$, (entity:any, tags) => { // Uno los dos observables y espera que se ejecuten
      entity.tags = tags; // Le pone los tags al snippet
      return entity;
    })
      .flatMap((entity:any) => {
        entity.body = data.arg.body; // Pone el body
        entity.title = data.arg.title; // Pone el title
        return Observable.fromPromise(entity.save()); // Salva el objeto y devuelve el observable
      })
      ;
  }
}
