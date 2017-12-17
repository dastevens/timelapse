import { actionCreatorFactory, AnyAction } from 'typescript-fsa';
import { Dispatch } from 'react-redux';
import wrapAsyncWorker from './wrapAsyncWorker';
import { ProjectID } from '../model/Project';
import {
    previewProject as apiPreviewProject,
    startProject as apiStartProject,
    stopProject as apiStopProject,
} from '../api/Projects';

const actionCreator = actionCreatorFactory();

export const PreviewAction = actionCreator.async<ProjectID, string>('Preview');
const previewWorker = wrapAsyncWorker<ProjectID, string, void>(
    PreviewAction, (params: ProjectID): Promise<string> => apiPreviewProject(params.name)
);
export const StartAction = actionCreator.async<ProjectID, void>('Start');
const startWorker = wrapAsyncWorker<ProjectID, void, void>(
    StartAction, (params: ProjectID): Promise<void> => apiStartProject(params.name)
);
export const StopAction = actionCreator.async<ProjectID, void>('Stop');
const stopWorker = wrapAsyncWorker<ProjectID, void, void>(
    StopAction, (params: ProjectID): Promise<void> => apiStopProject(params.name)
);

export const controlProject = {
    preview: (name: string) => (dispatch: Dispatch<AnyAction>) => previewWorker(dispatch, { name }),
    start: (name: string) => (dispatch: Dispatch<AnyAction>) => startWorker(dispatch, { name }),
    stop: (name: string) => (dispatch: Dispatch<AnyAction>) => stopWorker(dispatch, { name }),
};