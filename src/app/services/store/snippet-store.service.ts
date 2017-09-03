import { IpcClientService } from './../ipc.client.service';
import { Injectable } from '@angular/core';
import {SnippetInterface} from "../../domain_types";
import {BehaviorSubject} from "rxjs/Rx";

@Injectable()
export class SnippetStoreService {

  constructor(
    private ipc: IpcClientService
  ) { }

  getMoreUsed$(data) {
    return this.ipc.send('snippet.more_used', data);
  }
  
  newest$(data) {
    return this.ipc.send('snippet.newest', data);
  }

  get$(id, increment_view = false) {
    let entity$ = new BehaviorSubject(null);
    this.ipc.send('snippet.get', {
      id: id,
      increment_view: increment_view,
    }).subscribe(entity => entity$.next(entity));
    return entity$.filter(entity => entity != null);
  }

  save$(entity: SnippetInterface) {
    if (entity._id) {
      return this.ipc.send('snippet.edit', entity);
    }
    return this.ipc.send('snippet.create', entity);
  }
}
