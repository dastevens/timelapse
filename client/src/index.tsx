import * as React from 'react';
import {
    applyMiddleware,
    combineReducers,
    createStore,
} from 'redux';
import reduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import { AppContainer } from './AppContainer';
import { projectListReducer } from './redux/projectListReducer';
import { projectReducer } from './redux/projectReducer';

const reducers = combineReducers({
    projectList: projectListReducer,
    project: projectReducer,
});

let store = createStore(
    reducers,
    applyMiddleware(reduxThunk, logger)
);

// Render the app
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
ReactDOM.render(
    <Provider store={store}><AppContainer /></Provider>,
    document.getElementById('root')
);

import { loadProjects } from './redux/LoadProjectsAction';
store.dispatch(loadProjects());