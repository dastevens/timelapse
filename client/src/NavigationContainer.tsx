import { connect, Dispatch } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import {
    Events,
    Fields,
    NavigationComponent
} from './NavigationComponent';
import { ProjectListState } from './redux/projectListReducer';
import { SelectProjectAction } from './redux/SelectProjectAction';

const mapStateToProps = (state: { projectList: ProjectListState }): Fields => ({
    projects: state.projectList.projects,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): Events => {
    return {
        selectProject: (projectName: string) => dispatch(SelectProjectAction({ projectName }))
    };
};

export const NavigationContainer = connect(mapStateToProps, mapDispatchToProps)(NavigationComponent);
