/**
 * componente principal de la aplicación
 */

import {AppStoreService} from './services/store/app-store.service';
import {Observable} from 'rxjs/Rx';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SnippetInterface} from "./domain_types";
import {SnippetStoreService} from "./services/store/snippet-store.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  pageReady$:Observable<boolean>;
  appReady$:Observable<boolean>;
  lastViews$:Observable<SnippetInterface[]>;
  hasLastView$:Observable<boolean>;

  constructor(private appStore:AppStoreService,
              private snippetStore:SnippetStoreService) {
  }

  ngOnInit() {
    this.lastViews$ = this.snippetStore.lastViews$; // Observable con las últimas vistas
    this.hasLastView$ = this.snippetStore.lastViews$.map(list => list.length > 0); // Indica si ya tengo algún elemento en las últimas vistas
    this.appReady$ = this.appStore.backendReady$.map(() => true); // Para conocer cuando esté listo el servidor
    this.pageReady$ = this.appStore.pageReady$; // Para mostrar o esconder el loader de página
  }
}
