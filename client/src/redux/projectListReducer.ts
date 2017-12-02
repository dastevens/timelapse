import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
    Failure,
    Success,
} from 'typescript-fsa';
import { Project } from '../model/Project';
import { ProjectListState } from './StoreState';
import { LoadProjectsAction } from './LoadProjectsAction';

export const projectListReducer = reducerWithInitialState({
    loading: true, 
    projects: new Array<Project>(),
    errorMessage: ''
})
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
}));