import { TagInterface } from '../../domain_types';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { IpcClientService } from '../ipc.client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TagStoreService {

  constructor(
    private ipc: IpcClientService
  ) {
  }

  get all$(): Observable<any> {
    let all$ = new BehaviorSubject<any>(null);
    this.ipc.send('tag.all')
      .subscribe((data: TagInterface[]) => {
        all$.next(data);
      })
      ;
    return all$.filter(data => data != null);
  }
}
