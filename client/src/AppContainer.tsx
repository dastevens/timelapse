import { LoadingState } from './model/LoadingState';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { AppComponent, AppProps } from './AppComponent';
import { StoreState } from './model/StoreState';

const mapStateToProps = (state: StoreState): AppProps => ({
    projects: state.projectList.projects,
    loadingState: state.projectList.loadingState,
    projectName: state.projectName,
});
export const AppContainer = connect(mapStateToProps)(AppComponent);
const reducer = () => ({
    projectList: {
        projects: [],
        loadingState: LoadingState.Init,
        error: '',
    },
    projectName: '',
});
export const store = createStore(reducer);
