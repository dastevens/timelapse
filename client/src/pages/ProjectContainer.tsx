import { connect, Dispatch } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import { ProjectListState } from '../redux/projectListReducer';
import { ProjectState } from '../redux/projectReducer';
import {
    Events,
    Fields,
    ProjectComponent
} from './ProjectComponent';

const mapStateToProps = (state: { projectList: ProjectListState, project: ProjectState }): Fields => ({
    project: state.projectList.projects.find(project => project.name === state.project.projectName)
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): Events => {
    return {
    };
};

export const ProjectContainer = connect(mapStateToProps, mapDispatchToProps)(ProjectComponent);