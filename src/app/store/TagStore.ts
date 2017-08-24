import { Action } from '@ngrx/store';
import { Reducer, ActionHandler } from './util/Annotation';
import { IpcClientService, IpcClientData } from './../services/ipc.client.service';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';

@Injectable()
@Reducer('tag', {
    all: [],
})
export class TagStore {
    static readonly LOAD_ALL = '[TAG] LOAD_ALL';
    static readonly LOAD_ALL_SUSSES = '[TAG] LOAD_ALL_SUSSES';

    constructor(
        protected actions$: Actions,
        private ipc: IpcClientService,
    ) { }

    @Effect() onInit$ = this.actions$.ofType(TagStore.LOAD_ALL)
        .switchMap((action: Action) => this.ipc.send('tag.all'))
        .map(data => {
            return {
                type: TagStore.LOAD_ALL_SUSSES,
                payload: data,
            }
        })
    ;

    @ActionHandler(TagStore.LOAD_ALL_SUSSES, 'all')
    readyAction(state: any, action: Action) {
        return action.payload;
    }
}