import { IpcClientService } from './../ipc.client.service';
import { Injectable } from '@angular/core';
import {SnippetInterface} from "../../domain_types";
import {BehaviorSubject} from "rxjs/Rx";

@Injectable()
export class SnippetStoreService {

  constructor(
    private ipc: IpcClientService
  ) { }

  getMoreUsed$() {
    return this.ipc.send('snippet.more_used');
  }

  get$(id) {
    let entity$ = new BehaviorSubject(null);
    this.ipc.send('snippet.get', id).subscribe(entity => entity$.next(entity));
    return entity$.filter(entity => entity != null);
  }

  save$(entity: SnippetInterface) {
    if (entity._id) {
      return this.ipc.send('snippet.edit', entity);
    }
    return this.ipc.send('snippet.create', entity);
  }
}
