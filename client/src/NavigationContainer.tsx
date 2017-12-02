import { connect, Dispatch } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import {
    Events,
    Fields,
    NavigationComponent
} from './NavigationComponent';
import { StoreState } from './redux/StoreState';
import { selectProject } from './redux/SelectProjectAction';
import { Project } from './model/Project';

const mapStateToProps = (state: StoreState): Fields => ({
    projects: state.projectList.projects,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): Events => {
    return {
        selectProject: (project?: Project) => dispatch(selectProject(project))
    };
};

export const NavigationContainer = connect(mapStateToProps, mapDispatchToProps)(NavigationComponent);
