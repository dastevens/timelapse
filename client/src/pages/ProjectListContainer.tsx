import { connect, Dispatch } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import { StoreState } from '../redux/StoreState';
import {
    Events,
    Fields,
    ProjectListComponent
} from './ProjectListComponent';
import { Project } from '../model/Project';
import { createProject } from '../redux/CreateProjectAction';
import { selectProject } from '../redux/SelectProjectAction';

const mapStateToProps = (state: StoreState): Fields => ({
    projects: state.projectList.projects,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): Events => {
    return {
        createProject: () => dispatch(createProject()),
        selectProject: (project?: Project) => dispatch(selectProject(project)),
    };
};

export const ProjectListContainer = connect(mapStateToProps, mapDispatchToProps)(ProjectListComponent);