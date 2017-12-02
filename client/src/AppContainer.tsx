import { connect } from 'react-redux';
import { AppComponent, Fields } from './AppComponent';
import { StoreState } from './redux/StoreState';

const mapStateToProps = (state: StoreState): Fields => ({
    project: state.project.project,
});

export const AppContainer = connect(mapStateToProps)(AppComponent);
