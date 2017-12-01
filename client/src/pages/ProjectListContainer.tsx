import { connect, Dispatch } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import { ProjectListState } from '../redux/projectListReducer';
import {
    Events,
    Fields,
    ProjectListComponent
} from './ProjectListComponent';
import { SelectProjectAction } from '../redux/SelectProjectAction';

const mapStateToProps = (state: { projectList: ProjectListState }): Fields => ({
    projects: state.projectList.projects,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): Events => {
    return {
        selectProject: (projectName: string) => dispatch(SelectProjectAction({projectName}))
    };
};

export const ProjectListContainer = connect(mapStateToProps, mapDispatchToProps)(ProjectListComponent);