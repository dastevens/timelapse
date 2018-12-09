import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
    SetProjectDescriptionAction,
    SetProjectImagesAction,
    SetProjectIntervalAction,
    SetProjectNameAction,
    SetProjectStartAction,
    DismissPreviewAction
} from '../redux/EditProjectAction';
import { SelectProjectAction } from './SelectProjectAction';
import { Project, ProjectID } from '../model/Project';
import { ProjectState } from './StoreState';
import { CreateProjectAction, CreateProjectParams } from './CreateProjectAction';
import { Success } from 'typescript-fsa';
import { DeleteProjectAction, DeleteProjectParams } from './DeleteProjectAction';
import { PreviewAction } from './ControlProjectAction';

export const projectReducer = reducerWithInitialState<ProjectState>({
    project: undefined,
    previewUrl: undefined,
})
    .case(CreateProjectAction.done, (state: ProjectState, payload: Success<CreateProjectParams, Project>) => ({
        ...state,
        project: payload.result,
    }))
    .case(DeleteProjectAction.done, (state: ProjectState, payload: Success<DeleteProjectParams, string>) => ({
        ...state,
        project: undefined,
    }))
    .case(DismissPreviewAction, (state: ProjectState, payload: Success<{}, string>) => ({
        ...state,
        previewUrl: undefined
    }))
    .case(PreviewAction.done, (state: ProjectState, payload: Success<ProjectID, string>) => ({
        ...state,
        previewUrl: payload.result
    }))
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