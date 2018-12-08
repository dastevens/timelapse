import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
    Failure,
    Success,
} from 'typescript-fsa';
import { Project } from '../model/Project';
import { ProjectListState } from './StoreState';
import {
    DeleteProjectAction,
    DeleteProjectParams
} from './DeleteProjectAction';
import { LoadProjectsAction } from './LoadProjectsAction';
import { CreateProjectAction, CreateProjectParams } from './CreateProjectAction';
import { SaveProjectAction } from './SaveProjectAction';

export const projectListReducer = reducerWithInitialState({
    loading: true,
    projects: new Array<Project>(),
    errorMessage: ''
})
    .case(CreateProjectAction.started, (state: ProjectListState, dummy: null) => ({
        ...state,
        loading: true
    }))
    .case(CreateProjectAction.done, (state: ProjectListState, payload: Success<CreateProjectParams, Project>) => ({
        ...state,
        projects: state.projects.concat([payload.result]).sort((a, b) => a.name.localeCompare(b.name)),
        loading: false
    }))
    .case(CreateProjectAction.failed, (state: ProjectListState, code: Failure<CreateProjectParams, string>) => ({
        ...state,
        errorMessage: 'Error creating project: ' + code.error,
        loading: false
    }))
    .case(LoadProjectsAction.started, (state: ProjectListState, dummy: null) => ({
        ...state,
        loading: true
    }))
    .case(LoadProjectsAction.done, (state: ProjectListState, payload: Success<null, Project[]>) => ({
        ...state,
        projects: payload.result.sort((a, b) => a.name.localeCompare(b.name)),
        loading: false
    }))
    .case(LoadProjectsAction.failed, (state: ProjectListState, code: Failure<null, string>) => ({
        ...state,
        errorMessage: 'Error loading site list: ' + code.error
    }))
    .case(SaveProjectAction.done, (state: ProjectListState, payload: Success<Project, void>) => ({
        ...state,
        projects: state.projects.map(project => project.name !== payload.params.name ? project : payload.params),
    }))
    .case(DeleteProjectAction.done, (state: ProjectListState, payload: Success<DeleteProjectParams, string>) => ({
        ...state,
        projects: state.projects.filter(project => project.name !== payload.result)
    }))
    ;