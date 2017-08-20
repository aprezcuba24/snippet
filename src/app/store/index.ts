import * as Application from './ApplicationStore';
import { storeLogger } from "ngrx-store-logger";
import { combineReducers } from "@ngrx/store";
import { compose } from "@ngrx/core";
import { getReducers } from './util/Annotation';

export * from './ApplicationStore';

export const reducers = Object.assign({},
    getReducers(Application.ApplicationStore),
);

const developmentReducer: Function = compose(
    storeLogger(),
    combineReducers,
)(reducers);

export function metaReducer(state: any, action: any) {
    return developmentReducer(state, action);
}