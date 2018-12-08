import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
    SetProjectDescriptionAction,
    SetProjectImagesAction,
    SetProjectIntervalAction,
    SetProjectNameAction,
    SetProjectStartAction
} from '../redux/EditProjectAction';
import { SelectProjectAction } from './SelectProjectAction';
import { Project } from '../model/Project';
import { ProjectState } from './StoreState';

export const projectReducer = reducerWithInitialState<ProjectState>({
    project: undefined,
})
    // .case(CreateProjectAction, (state: ProjectState, payload: { }) => ({
    //     ...state,
    //     project: new Project(
    //         '',
    //         '',
    //         ProjectStatus.Setup,
    //         new Date(),
    //         1000,
    //         1
    //     )
    // }))
    .case(SelectProjectAction, (state: ProjectState, payload: { project?: Project }) => ({
        ...state,
        project: payload.project === undefined
            ? undefined
            : new Project(
                payload.project.name,
                payload.project.description,
                payload.project.status,
                payload.project.start,
                payload.project.images,
                payload.project.interval
            )
    }))
    .case(SetProjectDescriptionAction, (state: ProjectState, payload: { description: string }) => ({
        ...state,
        project: state.project === undefined
            ? undefined
            : new Project(
                state.project.name,
                payload.description,
                state.project.status,
                state.project.start,
                state.project.images,
                state.project.interval
            )
    }))
    .case(SetProjectImagesAction, (state: ProjectState, payload: { images: number }) => ({
        ...state,
        project: state.project === undefined
            ? undefined
            : new Project(
                state.project.name,
                state.project.description,
                state.project.status,
                state.project.start,
                payload.images,
                state.project.interval
            )
    }))
    .case(SetProjectIntervalAction, (state: ProjectState, payload: { interval: number }) => ({
        ...state,
        project: state.project === undefined
            ? undefined
            : new Project(
                state.project.name,
                state.project.description,
                state.project.status,
                state.project.start,
                state.project.images,
                payload.interval
            )
    }))
    .case(SetProjectNameAction, (state: ProjectState, payload: { name: string }) => ({
        ...state,
        project: state.project === undefined
            ? undefined
            : new Project(
                payload.name,
                state.project.description,
                state.project.status,
                state.project.start,
                state.project.images,
                state.project.interval
            )
    }))
    .case(SetProjectStartAction, (state: ProjectState, payload: { start: Date }) => ({
        ...state,
        project: state.project === undefined
            ? undefined
            : new Project(
                state.project.name,
                state.project.description,
                state.project.status,
                isNaN(payload.start.getTime()) ? state.project.start : payload.start,
                state.project.images,
                state.project.interval
            )
    }))
;