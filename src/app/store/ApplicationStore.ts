import { AppState } from './index';
import { Observable } from 'rxjs/Rx';
import { IpcClientService, IpcClientData } from './../services/ipc.client.service';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Reducer, ActionHandler } from './util/Annotation';
import { Injectable } from '@angular/core';

export type ApplicationState = {
    ready: boolean,
    init_error: string,
};

@Injectable()
@Reducer('application', {
    ready: false,
    init_error: '',
})
export class ApplicationStore {
    static readonly INIT = '[APP] INIT';
    static readonly READY = '[APP] READY';
    static readonly INIT_ERROR = '[APP] INIT_ERROR';

    constructor(
        protected actions$: Actions,
        private ipc: IpcClientService,
        private store: Store<AppState>
    ) {
    }

    @Effect() onInit$ = this.actions$.ofType(ApplicationStore.INIT)
        .switchMap((action: Action) => this.ipc.send('init'))
        .map((data: IpcClientData) => {
            return {
                type: ApplicationStore.READY
            }
        })
        .catch(err => Observable.of({
            type: ApplicationStore.INIT_ERROR,
            payload: err,
        }))
    ;

    @ActionHandler(ApplicationStore.READY, 'ready')
    readyAction(state: ApplicationState, action: Action) {
        return true;
    }

    @ActionHandler(ApplicationStore.INIT_ERROR, 'init_error')
    initErrorAction(state: ApplicationState, action: Action) {
        return action.payload;
    }
}