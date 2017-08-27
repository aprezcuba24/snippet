import { BehaviorSubject } from 'rxjs/Rx';
import { IpcClientService } from './../ipc.client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AppStoreService {

  private _backendReady$ = new BehaviorSubject(false);
  private _pageReady$ = new BehaviorSubject(false);

  constructor(
    private ipc: IpcClientService
  ) {
    this.ipc.send('init')
      .filter(data => data == true)
      .take(1)
      .subscribe(() => {
        this._backendReady$.next(true);
      })
      ;
  }

  get backendReady$() {
    return this._backendReady$.filter(ready => ready == true);
  }

  setPageReady(ready) {
    this._pageReady$.next(ready);
  }

  get pageReady$() {
    return this._pageReady$.distinctUntilChanged();
  }
}
