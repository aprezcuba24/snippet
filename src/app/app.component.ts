import { Observable } from 'rxjs/Rx';
import { ApplicationStore } from './store';
import { IpcClientService, IpcClientData } from './services/ipc.client.service';
import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppStore from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  title$: Observable<string>;

  constructor(
    private store: Store<AppStore.AppState>,
    private ipc: IpcClientService,
    private zone: NgZone,
  ) {}

  ngOnInit() {
    this.title$ = this.store.select('application')
      .map((state: AppStore.ApplicationState) => state.ready)
      .distinctUntilChanged()
      .filter(data => data == true)
      .map(data => {
        return 'Ya conectado';
      })
      ;
    this.store.select('application')
      .map((state: AppStore.ApplicationState) => state.init_error)
      .distinctUntilChanged()
      .filter(err => err != "")
      .subscribe(err => {
        console.log(err);
      })
      ;
    this.store.dispatch({
      type: ApplicationStore.INIT,
    });
  }
}
