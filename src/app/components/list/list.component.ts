/**
 * Componente para mostrar un listado de snippets
 */
import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {Observable} from "rxjs/Rx";
import {SnippetInterface} from "../../domain_types";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {

  @Input() method:Function; // Método que va usar
  itemsPerPage = 10;
  page = 1;
  total:number;
  loading = false;
  list$:Observable<SnippetInterface[]>; // Observable con los snippets
  paginateId:string;

  constructor() {
    // Genero un id único para el paginador y que no entre en conflicto con otros
    this.paginateId = Math
      .floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  ngOnInit() {
    this.getPage(1); // Cargo la página 1
  }

  getPage(page:number) {
    this.loading = true;
    this.list$ = this.method({ // Llamo al método
      page: page,
      itemsPerPage: this.itemsPerPage,
    })
      .do((res:any) => {
        this.total = res.total; // Me quedo con el total
        this.page = page; // la página
        this.loading = false; // escondo el loader
      })
      .map(res => res.items); // devuelvo los snippets que se almacenaran en "list$"
  }

}
