import { Action } from '@ngrx/store';
import * as R from 'reflect-metadata';

const REDUCER_KEY = Symbol("Reducer");

export const getReducers = function (target: any) {
    let classData = Reflect.getMetadata(REDUCER_KEY, target);
    let redurcers = [];
    let mainReducer = {};
    for (let key in target.prototype) {
        if (!target.prototype[key].__actionHandlerState) {
            continue;
        }
        let stateName = target.prototype[key].__actionHandlerState;
        mainReducer[classData.stateNamepase + '.' + stateName] = function (state, action) {
            if (!state) {
                state = classData.initialState[stateName];
            }
            return target.prototype[key](state, action)
        }
    }

    return mainReducer;
}

export const Reducer = function (stateNamepase, initialState = {}) {
    return Reflect.metadata(REDUCER_KEY, {
        stateNamepase: stateNamepase,
        initialState: initialState,
    });
}

export const ActionHandler = function (actionType: string | string[], state: string): MethodDecorator {
    return function (target: Function, key: string, descriptor: any) {
        var originalMethod = descriptor.value;
        descriptor.value = function (state, action: Action) {
            if (actionType instanceof Array) {
                if (!actionType.filter(value => value == action.type)) {
                    return state;
                }
            } else if (action.type != actionType) {
                return state;
            }
            return originalMethod.apply(this, [state, action]);
        }
        descriptor.value.__actionHandlerState = state;

        return descriptor;
    }
}