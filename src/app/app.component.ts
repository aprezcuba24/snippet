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

  title$: Observable<string>;

  constructor(
    private store: Store<any>
  ) {}

  ngOnInit() {
    this.title$ = this.store.select('application.ready')
      .map(data => 'Ya conectado')
      ;
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
