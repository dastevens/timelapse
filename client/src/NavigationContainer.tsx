import { connect, Dispatch } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import {
    Events,
    Fields,
    NavigationComponent
} from './NavigationComponent';
import { StoreState } from './redux/StoreState';
import { createProject } from './redux/CreateProjectAction';
import { selectProject } from './redux/SelectProjectAction';
import { Project } from './model/Project';

const mapStateToProps = (state: StoreState): Fields => ({
    projects: state.projectList.projects,
    createProjectName: state.createProject.name,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): Events => {
    return {
        selectProject: (project?: Project) => dispatch(selectProject(project)),
        setCreateProjectName: (name: string) => dispatch(createProject.setName(name)),
        createProject: (name: string) => dispatch(createProject.create(name)),
    };
};

export const NavigationContainer = connect(mapStateToProps, mapDispatchToProps)(NavigationComponent);
