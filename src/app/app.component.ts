import { TagStore } from './store/TagStore';
import { Observable, Subscription } from 'rxjs/Rx';
import { ApplicationStore } from './store';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  pageReady$: Observable<boolean>;
  appReady$: Observable<boolean>;
  tags$: Observable<any>;
  private readySubscription: Subscription;

  constructor(
    private store: Store<any>
  ) {}

  ngOnInit() {
    this.appReady$ = this.store.select('application.ready');
    this.pageReady$ = this.store.select('application.page_ready');
    this.store.select('application.init_error')
      .subscribe(err => {
        console.log(err);
      })
      ;
    this.tags$ = this.store.select('tag.all');
    this.store.dispatch({
      type: ApplicationStore.INIT,
    });
    this.readySubscription = this.appReady$
      .filter(ready => ready == true)
      .subscribe(() => {
        this.store.dispatch({
          type: TagStore.LOAD_ALL,
        });
      });
  }

  ngOnDestroy() {
    this.readySubscription.unsubscribe();
  }
}
