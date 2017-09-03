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
  
    @Input() method: Function;
    itemsPerPage = 10;
    page = 1;
    total: number;
    loading = false;
    list$: Observable<SnippetInterface[]>;
    paginateId: string;

    constructor() {
        this.paginateId = Math
            .floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    ngOnInit() {
        this.getPage(1);
    }

    getPage(page: number) {
        this.loading = true;
        this.list$ = this.method({
            page: page,
            itemsPerPage: this.itemsPerPage,
        })
            .do((res: any) => {
              this.total = res.total;
              this.page = page;
              this.loading = false;
            })
            .map(res => res.items);
    }

}
