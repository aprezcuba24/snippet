import { Observable } from 'rxjs/Rx';
import { ApplicationStore } from './store';
import { IpcClientService, IpcClientData } from './services/ipc.client.service';
import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppStore from './store';
declare let electron: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  title$: Observable<string>;
  otro = 'fasdd';

  constructor(
    private store: Store<AppStore.AppState>,
    private ipc: IpcClientService,
    private zone: NgZone,
  ) {}

  ngOnInit() {
    let ipc = electron.ipcRenderer;
    ipc.send('init', JSON.stringify(null));
    ipc.on('init', (event, arg) => {
      this.otro = 'AAAAA';
      console.log('PASE...');
    });


    // this.title$ = this.store.select('application')
    //   .map((state: AppStore.ApplicationState) => state.ready)
    //   .distinctUntilChanged()
    //   .filter(data => data == true)
    //   .map(data => {
    //     return 'Ya conectado';
    //   })
    //   .do(data => console.log(data))
    //   .do(data => this.otro = data)
    //   ;
    // this.store.select('application')
    //   .map((state: AppStore.ApplicationState) => state.init_error)
    //   .distinctUntilChanged()
    //   .filter(err => err != "")
    //   .subscribe(err => {
    //     console.log(err);
    //   })
    //   ;
    // this.store.dispatch({
    //   type: ApplicationStore.INIT,
    // });
  }
}
