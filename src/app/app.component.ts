import { AppStoreService } from './services/store/app-store.service';
import { Observable } from 'rxjs/Rx';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {SnippetInterface} from "./domain_types";
import {SnippetStoreService} from "./services/store/snippet-store.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    pageReady$: Observable<boolean>;
    appReady$: Observable<boolean>;
    lastViews$: Observable<SnippetInterface[]>;
    hasLastView$: Observable<boolean>;

    constructor(
        private appStore: AppStoreService,
        private snippetStore: SnippetStoreService
    ) {}

    ngOnInit() {
        this.lastViews$ = this.snippetStore.lastViews$;
        this.hasLastView$ = this.snippetStore.lastViews$.map(list => list.length > 0);
        this.appReady$ = this.appStore.backendReady$.map(() => true);
        this.pageReady$ = this.appStore.pageReady$;
    }
}
