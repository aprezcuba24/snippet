import { AppStoreService } from '../../services/store/app-store.service';
import { SnippetStoreService } from '../../services/store/snippet-store.service';
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

    moreUsedMethod: Function;
    moreNewestthod: Function;
    searchMethod: Function;
    tags$: Observable<TagInterface[]>;
    tagsSelected: any[];
    show_search_list = false;

    constructor(
        private snippetStore: SnippetStoreService,
        private appStore: AppStoreService,
        private tagStore: TagStoreService
    ) {
        this.tags$ = this.tagStore.all$;
        this.moreUsedMethod = this.snippetStore.getMoreUsed$.bind(this.snippetStore);
        this.moreNewestthod = this.snippetStore.newest$.bind(this.snippetStore);
        this.searchMethod = this.snippetStore.search$.bind(this.snippetStore);
        this.searchMethod = (data) => {
            return this.snippetStore.search$(data)
                .do((data: any) => this.show_search_list = data.total > 0)
            ;
        };
        //noinspection TypeScriptValidateTypes
        this.snippetStore.tagsFilters$
            .take(1)
            .subscribe(items => {
                this.tagsSelected = items;
            })
        ;
    }

    ngOnInit() {
        this.appStore.setPageReady(true);
    }

    search() {
        this.snippetStore.tagsFilter$ = this.tagsSelected;
    }
}
