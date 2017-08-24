import { Observable } from 'rxjs/Rx';
import { IpcClientService, IpcClientData } from './../services/ipc.client.service';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Reducer, ActionHandler } from './util/Annotation';
import { Injectable } from '@angular/core';

@Injectable()
@Reducer('application', {
    ready: false,
    init_error: '',
    page_ready: false,
})
export class ApplicationStore {
    static readonly INIT = '[APP] INIT';
    static readonly READY = '[APP] READY';
    static readonly INIT_ERROR = '[APP] INIT_ERROR';
    static readonly PAGE_READY = '[APP] PAGE_READY';

    constructor(
        protected actions$: Actions,
        private ipc: IpcClientService,
    ) {
    }

    @Effect() onInit$ = this.actions$.ofType(ApplicationStore.INIT)
        .switchMap((action: Action) => this.ipc.send('init').filter(data => data == true))
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
    readyAction(state: any, action: Action) {
        return true;
    }

    @ActionHandler(ApplicationStore.INIT_ERROR, 'init_error')
    initErrorAction(state: any, action: Action) {
        return action.payload;
    }

    @ActionHandler(ApplicationStore.PAGE_READY, 'page_ready')
    pageReadyAction(state: any, action: Action) {
        return action.payload;
    }
}