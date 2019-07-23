import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

const initialState = {
    isAuthed: false
};

const reducer  = (state = initialState, action) => {
    switch(action.type) {
        case 'AUTHENTICATING':
            return state;
        case 'AUTH_SUCCESS':
            return {
                ...state,
                isAuthed: action.payload
            };
        case 'AUTH_FAIL':
            return state;
        default:
            return state;
    }
};

const store = createStore(reducer, applyMiddleware(logger));

export default store;