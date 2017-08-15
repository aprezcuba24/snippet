import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Reducer, ActionHandler } from './util/Annotation';
import { Injectable } from '@angular/core';

export type ApplicationState = {
    ready: boolean,
};

@Injectable()
@Reducer('application', {
    ready: false,
})
export class ApplicationStore {
    static readonly INIT = '[APP] INIT';
    static readonly READY = '[APP] READY';

    constructor(
        protected actions$: Actions
    ) { }

    // @Effect() removeMessage$ = this.actions$.ofType(ApplicationStore.NEW_MESSAGE)
    //     .delay(3000)
    //     .map(data => {
    //         return {
    //             type: ApplicationStore.REMOVE_MESSAGE,
    //         }
    //     })
    // ;

    // @ActionHandler(ApplicationStore.NEW_MESSAGE, 'message')
    // newMessageAction(state: ApplicationState, action: Action) {
    //     return action.payload;
    // }

    // @ActionHandler(ApplicationStore.REMOVE_MESSAGE, 'message')
    // removeMessageAction(state: ApplicationState, action: Action) {
    //     return '';
    // }
}