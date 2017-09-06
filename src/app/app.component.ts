import { AppStoreService } from './services/store/app-store.service';
import { TagStoreService } from './services/store/tag-store.service';
import { Observable } from 'rxjs/Rx';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    pageReady$: Observable<boolean>;
    appReady$: Observable<boolean>;
    tags$: Observable<any>;

    constructor(
        private tagStore: TagStoreService,
        private appStore: AppStoreService
    ) {}

    ngOnInit() {
        this.tags$ = this.appStore
        .backendReady$
            .flatMap(() => this.tagStore.all$)
        ;
        this.appReady$ = this.tags$.map(() => true);
        this.pageReady$ = this.appStore.pageReady$;
    }
}
