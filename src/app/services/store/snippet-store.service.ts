import { IpcClientService } from './../ipc.client.service';
import { Injectable } from '@angular/core';
import {SnippetInterface, TagInterface} from "../../domain_types";
import {BehaviorSubject} from "rxjs/Rx";

@Injectable()
export class SnippetStoreService {

    private _tagsFilters$ = new BehaviorSubject<TagInterface[]>([]);

    constructor(
        private ipc: IpcClientService
    ) { }

    getMoreUsed$(data) {
        return this.ipc.send('snippet.more_used', data);
    }

    newest$(data) {
        return this.ipc.send('snippet.newest', data);
    }

    search$(data) {
        return this.tagsFilters$
            .map(tags => {
                return Object.assign(data, {
                    tags: tags,
                })
            })
            .flatMap(data => this.ipc.send('snippet.search', data).take(1))
        ;
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

    get tagsFilters$() {
        return this._tagsFilters$;
    }

    set tagsFilter$(tags) {
        tags = tags || [];
        this._tagsFilters$.next(tags);
    }
}
