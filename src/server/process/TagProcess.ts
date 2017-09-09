/**
 * Proceso para gestionar los tags
 */

import {IpcInput, IpcService} from './../IpcService';
import {Observable} from 'rxjs/Rx';
import {Tag} from './../domain/tag';
import {Injectable} from '@angular/core';
import {TagInterface} from "../../app/domain_types";

@Injectable()
export class TagProcess {
  private tagAllEvent;

  constructor(private ipc:IpcService) {
    this.ipc.process( // procesa los mensajes que pide todos los tags
      'tag.all',
      (data:IpcInput) => {
        this.tagAllEvent = data.event; // Me quedo con el evento para poder enviar los tags cuando refresque
        return this.getAll$()
      }
    );
  }

  /**
   * Este método se usa para refrescar los tags en el cliente,  cuando se adiciona un nuevo
   * realmente en  el cliente ahora no se está usando
   */
  refreshAll() {
    this.getAll$().subscribe(
      tags => this.ipc.send('tag.all', this.tagAllEvent, {
        data: tags
      })
    );
  }

  /**
   * Recupera todos los tags, ordenando por nombre
   * @returns {any}
     */
  getAll$() {
    return Observable.fromPromise(Tag.find({}, {
      sort: 'name'
    }));
  }

  /**
   * Resive un arreglo de tags, creando en base de datos los nuevos
   * Al final devuelve todos los tags desde la base de datos
   * @param tags
   * @returns {any}
     */
  getOrCreated$(tags:TagInterface[]) {
    return Observable.from(tags) // Empieza a devolver cada tag por separado
      .flatMap(item => Observable.combineLatest(
        Observable.of(item), // Devuelve el tag como mismo lo resive
        Observable.fromPromise(Tag.findOne({ // Busca el tag por el nombre
          name: item.name
        }))
      ))
      .flatMap(data => {
        if (data[1] == null) { // Si es null es porque no hay ningún tag como este en la base de datos
          let tag = Tag.create(data[0]);
          return Observable.fromPromise(tag.save()); // Devuelve un observable que crea el tag en base datos
        }
        return Observable.of(data[1]); // Devuelve el tag que ya estaba en la base de datos
      })
      .toArray() // Reuno todos los tags en un array
      .do(() => this.refreshAll()) //llamo al método "refreshAll" para que el cliente refresque los tags
      ;
  }
}
