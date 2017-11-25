import * as React from 'react';
import { AppContainer, store } from './AppContainer';

// Render the app
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
ReactDOM.render(
    <Provider store={store}><AppContainer /></Provider>,
    document.getElementById('root')
);