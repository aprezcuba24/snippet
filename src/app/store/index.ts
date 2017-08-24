import * as Application from './ApplicationStore';
import * as Tag from './TagStore';
import { storeLogger } from "ngrx-store-logger";
import { combineReducers } from "@ngrx/store";
import { compose } from "@ngrx/core";
import { getReducers } from './util/Annotation';

export * from './ApplicationStore';
export * from './TagStore';

export const reducers = Object.assign({},
    getReducers(Application.ApplicationStore),
    getReducers(Tag.TagStore),
);

const developmentReducer: Function = compose(
    storeLogger(),
    combineReducers,
)(reducers);

export function metaReducer(state: any, action: any) {
    return developmentReducer(state, action);
}