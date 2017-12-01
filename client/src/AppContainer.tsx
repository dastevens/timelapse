import { connect } from 'react-redux';
import { AppComponent, Fields } from './AppComponent';
import { ProjectState } from './redux/projectReducer';

const mapStateToProps = (state: { project: ProjectState }): Fields => ({
    projectName: state.project.projectName,
});

export const AppContainer = connect(mapStateToProps)(AppComponent);
