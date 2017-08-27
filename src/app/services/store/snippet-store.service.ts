import { IpcClientService } from './../ipc.client.service';
import { Injectable } from '@angular/core';
import {SnippetInterface} from "../../domain_types";

@Injectable()
export class SnippetStoreService {

  constructor(
    private ipc: IpcClientService
  ) { }

  getMoreUsed$() {
    return this.ipc.send('snippet.more_used');
  }

  get$(id) {
    return this.ipc.send('snippet.get', id);
  }

  save$(entity: SnippetInterface) {
    if (entity._id) {
      return this.ipc.send('snippet.edit', entity);
    }
    return this.ipc.send('snippet.create', entity);
  }
}
