import { Observable } from 'rxjs/Rx';
import { ApplicationStore } from './store';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  pageReady$: Observable<boolean>;
  appReady$: Observable<boolean>;

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
    this.store.dispatch({
      type: ApplicationStore.INIT,
    });
  }
}
