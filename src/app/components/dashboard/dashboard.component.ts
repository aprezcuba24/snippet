import { AppStoreService } from '../../services/store/app-store.service';
import { SnippetStoreService } from '../../services/store/snippet-store.service';
import { SnippetInterface } from '../../domain_types';
import { Observable } from 'rxjs/Rx';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

    moreUsed$: Observable<SnippetInterface[]>;
    newest$: Observable<SnippetInterface[]>;
    moreUsedData = {
        loading: false,
        page: 1,
        itemsPerPage: 10,
        total: 0,
    };
    newestData = {
        loading: false,
        page: 1,
        itemsPerPage: 10,
        total: 0,
    };

    constructor(
        private snippetStore: SnippetStoreService,
        private appStore: AppStoreService
    ) {
    }

    ngOnInit() {
        this.appStore.setPageReady(true);
        this.getMoreUsedPage(1);
        this.getNewestPage(1);
    }

    getNewestPage(page: number) {
        this.newestData.loading = true;
        this.newest$ = this.snippetStore.newest$({
            page: page,
            itemsPerPage: this.newestData.itemsPerPage,
        })
            .do((res: any) => {
                this.newestData.total = res.total;
                this.newestData.page = page;
                this.newestData.loading = false;
            })
            .map(res => res.items);
    }

    getMoreUsedPage(page: number) {
        this.moreUsedData.loading = true;
        this.moreUsed$ = this.snippetStore.getMoreUsed$({
            page: page,
            itemsPerPage: this.moreUsedData.itemsPerPage,
        })
            .do((res: any) => {
                this.moreUsedData.total = res.total;
                this.moreUsedData.page = page;
                this.moreUsedData.loading = false;
            })
            .map(res => res.items);
    }
}
