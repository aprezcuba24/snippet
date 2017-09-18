/**
 * Componente que gestiona la lógica de la interfaz de snippet
 */

import {Observable, Subscription} from 'rxjs/Rx';
import {SnippetInterface, TagInterface} from './../domain_types';
import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, ParamMap} from '@angular/router';
import {SnippetStoreService} from "../services/store/snippet-store.service";
import {AppStoreService} from "../services/store/app-store.service";
import {TagStoreService} from "../services/store/tag-store.service";

@Component({
  selector: 'app-snippet',
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnippetComponent implements OnInit, OnDestroy {

  action: string; // Acción seleccionada por el ususario, puede ser: detail, edit o new
  newEntity: SnippetInterface = {
    title: '',
    body: '',
    tags: [],
  };
  entity$: Observable<SnippetInterface>; // Observable que tiene la entidad que se debe mostrar o editar
  ready$: Observable<boolean>; // Observable que cuando sea true ya todos los datos están listo y se puede mostrar los componentes secundarios
  tags$: Observable<TagInterface[]>; // Arreglo de tags para el multiselect
  private subscription: Subscription; // Objeto para guardar una subscripción a un observable para al destruir el componente poder cerrar el canal

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snippetStore: SnippetStoreService,
    private appStore: AppStoreService,
    private tagStore: TagStoreService
  ) {
  }

  ngOnInit() {
    this.tags$ = this.tagStore.all$; //Obtengo el observable con los tags del servidor
    let params$ = this.route.paramMap // Obtengo el observable con los parámetros de entrada
      .map((params: ParamMap) => {
        return { // Obtengo la acción y el id
          action: this.route.snapshot.data['action'],
          id: params.get('id'),
        }
      })
      .do((data: any) => this.action = data.action) // guardo la acción en un campo del componente
    ;
    let new$ = params$ // Observable para procesar la acción new
      .filter((data: any) => data.action == 'new') // continuo en el flujo si es la acción new
      .map(() => true) // Ya está lista el proceso de la acción new
    ;
    let import$ = params$ // Observable para procesar la acción import
      .filter((data: any) => data.action == 'import') // continuo en el flujo si es la acción import
      .do(() => this.newEntity = this.snippetStore.entityImport) //pongo el objeto para el form
      .map(() => true) // Ya está lista el proceso de la acción import
    ;
    this.entity$ = params$ // Observable para procesar la acción que no sea new, es decir que sea edit o detail
      .filter((data: any) => data.action != 'new')//edit, detail
      .switchMap((data: any) => this.snippetStore.get$(data.id, data.action == 'detail')) // Cambio el flujo por el que busca la entidad en la  base de datos y si la acción es detail incremento la cantidad de visitas
      .publishReplay(1) // Estos dos métodos me permiten crear una cache de los datos para evitar hacer varias consultas al servidor
      .refCount()
    ;
    // Espero por el primero de los dos observables, si es new o editar-detail y espero por los tags
    this.ready$ = Observable.combineLatest(this.tags$, Observable.race(new$, import$, this.entity$))
      .map(() => true)
    ;
    this.subscription = this.ready$ // Cuando esté listo informo que la pantalla está lista
      .subscribe(() => {
          this.appStore.setPageReady(true);
      })
    ;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // cierro el canal cuando destrullo el componente
  }

  /**
   * Método para salvar o crear snippets
   * @param $event
     */
  save($event: SnippetInterface) {
    this.snippetStore.save$($event).subscribe((entity: SnippetInterface) => {
      this.router.navigate(['/snippet/detail', {
        id: entity._id
      }]);
    });
  }
}
