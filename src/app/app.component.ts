/**
 * componente principal de la aplicación
 */

import {AppStoreService} from './services/store/app-store.service';
import {Observable} from 'rxjs/Rx';
import {ChangeDetectionStrategy, Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {SnippetInterface} from "./domain_types";
import {SnippetStoreService} from "./services/store/snippet-store.service";
import {Router} from "@angular/router";
declare let $:any;

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
  @ViewChild("importFile") importFile:ElementRef;
  @ViewChild("importModal") importModal:ElementRef;

  constructor(private appStore:AppStoreService,
              private snippetStore:SnippetStoreService,
              private router:Router) {
  }

  ngOnInit() {
    this.lastViews$ = this.snippetStore.lastViews$; // Observable con las últimas vistas
    this.hasLastView$ = this.snippetStore.lastViews$.map(list => list.length > 0); // Indica si ya tengo algún elemento en las últimas vistas
    this.appReady$ = this.appStore.backendReady$.map(() => true); // Para conocer cuando esté listo el servidor
    this.pageReady$ = this.appStore.pageReady$; // Para mostrar o esconder el loader de página
  }

  importSnippet() {
    let fileReader = new FileReader();
    let file = this.importFile.nativeElement.files[0];
    if (!file) {
      return;
    }
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = (event:any) => {
      $(this.importFile.nativeElement).val(null);
      $(this.importModal.nativeElement).modal('hide');
      this.snippetStore.entityImport = event.target.result;
      this.router.navigate(['/snippet/import']);
    };
  }
}
