import { Action } from '@ngrx/store';
import * as R from 'reflect-metadata';

const REDUCER_KEY = Symbol("Reducer");

export const getReducers = function (target: any) {
    let classData = Reflect.getMetadata(REDUCER_KEY, target);
    let redurcers = [];
    for (let key in target.prototype) {
        if (!target.prototype[key].isActionHandler) {
            continue;
        }
        redurcers.push(target.prototype[key]);
    }
    let mainReducer = {};
    mainReducer[classData.stateNamepase] = function (state, action) {
        if (!state) {
            state = classData.initialState;
        }
        for (let index in redurcers) {
            state = redurcers[index](state, action);
        }

        return state;
    }

    return mainReducer;
}

export const Reducer = function (stateNamepase, initialState = {}) {
    return Reflect.metadata(REDUCER_KEY, {
        stateNamepase: stateNamepase,
        initialState: initialState,
    });
}

export const ActionHandler = function (actionType, replace = null): MethodDecorator {
    return function (target: Function, key: string, descriptor: any) {
        var originalMethod = descriptor.value;
        descriptor.value = function (state, action: Action) {
            if (action.type != actionType) {
                return state;
            }
            let value = originalMethod.apply(this, [state, action]);
            if (!replace) {
                return value;
            }
            if (value == state[replace]) {
                return state;
            }
            let newState = {};
            newState[replace] = value;

            return { ...state, ...newState };
        }
        descriptor.value.isActionHandler = true;

        return descriptor;
    }
}