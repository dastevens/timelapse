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
import { CopyProjectAction } from './CopyProjectAction';

export const projectReducer = reducerWithInitialState<ProjectState>({
    project: undefined,
    previewUrl: undefined,
})
    .case(CopyProjectAction.done, (state: ProjectState, payload: Success<Project, Project>) => ({
        ...state,
        project: payload.result,
    }))
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
            : payload.project
    }))
    .case(SetProjectDescriptionAction, (state: ProjectState, payload: { description: string }) => ({
        ...state,
        project: state.project === undefined
            ? undefined
            : { ...state.project,
                description: payload.description
            }
    }))
    .case(SetProjectImagesAction, (state: ProjectState, payload: { images: number }) => ({
        ...state,
        project: state.project === undefined
            ? undefined
            : {
                ...state.project,
                images: payload.images
            }
    }))
    .case(SetProjectIntervalAction, (state: ProjectState, payload: { interval: number }) => ({
        ...state,
        project: state.project === undefined
            ? undefined
            : {
                ...state.project,
                interval: payload.interval
            }
    }))
    .case(SetProjectNameAction, (state: ProjectState, payload: { name: string }) => ({
        ...state,
        project: state.project === undefined
            ? undefined
            : {
                ...state.project,
                name: payload.name
            }
    }))
    .case(SetProjectStartAction, (state: ProjectState, payload: { start: Date }) => ({
        ...state,
        project: state.project === undefined
            ? undefined
            : {
                ...state.project,
                start: isNaN(payload.start.getTime()) ? state.project.start : payload.start,
            }
    }))
;