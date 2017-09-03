import { AppStoreService } from '../../services/store/app-store.service';
import { SnippetStoreService } from '../../services/store/snippet-store.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

    moreUsedMethod: Function;
    moreNewestthod: Function;

    constructor(
        private snippetStore: SnippetStoreService,
        private appStore: AppStoreService
    ) {
        this.moreUsedMethod = this.snippetStore.getMoreUsed$.bind(this.snippetStore)
        this.moreNewestthod = this.snippetStore.newest$.bind(this.snippetStore)
    }

    ngOnInit() {
        this.appStore.setPageReady(true);
    }
}
