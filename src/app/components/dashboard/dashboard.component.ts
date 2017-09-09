import {AppStoreService} from '../../services/store/app-store.service';
import {SnippetStoreService} from '../../services/store/snippet-store.service';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from "rxjs/Rx";
import {TagInterface} from "../../domain_types";
import {TagStoreService} from "../../services/store/tag-store.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  moreUsedMethod:Function; // Función para buscar los snippets más usados
  moreNewestthod:Function; // Función para buscar los snippets nuevos
  searchMethod:Function; // Función para la búsqueda de snippets
  tags$:Observable<TagInterface[]>; //Observable para los otener los tags
  tagsSelected:any[]; // Tags seleccionado en el buscador
  show_search_list = false; // Bandera para indicar si debe mostrar o no el listado de la búsqueda

  constructor(private snippetStore:SnippetStoreService,
              private appStore:AppStoreService,
              private tagStore:TagStoreService) {
    this.tags$ = this.tagStore.all$; // Obtengo el observable con todos los tags
    // Conectar las funciones
    this.moreUsedMethod = this.snippetStore.getMoreUsed$.bind(this.snippetStore);
    this.moreNewestthod = this.snippetStore.newest$.bind(this.snippetStore);
    this.searchMethod = this.snippetStore.search$.bind(this.snippetStore);
    this.searchMethod = (data) => {
      return this.snippetStore.search$(data)
        .do((data:any) => this.show_search_list = data.total > 0) // Si hay elementos muestro el listado de la búsqueda
        ;
    };
    //noinspection TypeScriptValidateTypes
    this.snippetStore.tagsFilters$ //Obtengo los tags que ya estaban en el filtro, para volver a mostrar la búsqueda que había
      .take(1) // Hago que solo se ejecute una vez
      .subscribe(items => {
        this.tagsSelected = items;
      })
    ;
  }

  ngOnInit() {
    this.appStore.setPageReady(true); // Digo que ya la página está lista para que se esconda el loader
  }

  search() {
    // Método para ejecutar la vista
    this.snippetStore.tagsFilter$ = this.tagsSelected;
  }
}
