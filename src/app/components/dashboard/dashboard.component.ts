import { AppStoreService } from '../../services/store/app-store.service';
import { SnippetStoreService } from '../../services/store/snippet-store.service';
import { SnippetInterface } from '../../domain_types';
import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  moreUsed$: Observable<SnippetInterface[]>;

  constructor(
    private snippetStore: SnippetStoreService,
    private appStore: AppStoreService,
  ) {
    this.moreUsed$ = this.snippetStore.getMoreUsed$()
      .do(() => {
        this.appStore.setPageReady(true);
      })
      ;
  }
}
