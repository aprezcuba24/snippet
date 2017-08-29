import { AppStoreService } from './app-store.service';
import { TagInterface } from '../../domain_types';
import { BehaviorSubject } from 'rxjs/Rx';
import { IpcClientService } from '../ipc.client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TagStoreService {
  private _all$ = new BehaviorSubject([]);
  private ready = false;

  constructor(
    private ipc: IpcClientService,
    private appStore: AppStoreService
  ) {
    this.appStore.backendReady$
      .subscribe(() => {
        this.ipc.send('tag.all')
          .subscribe((data: TagInterface[]) => {
            this.ready = true;
            this._all$.next(data);
          })
          ;
      });
  }

  get all$() {
    return this._all$.filter(() => this.ready == true);
  }
}
