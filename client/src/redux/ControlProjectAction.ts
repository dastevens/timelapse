import { actionCreatorFactory, AnyAction } from 'typescript-fsa';
import { Dispatch } from 'react-redux';
import wrapAsyncWorker from './wrapAsyncWorker';
import { ProjectID } from '../model/Project';
import {
    previewProject as apiPreviewProject,
} from '../api/Projects';

const actionCreator = actionCreatorFactory();

export const PreviewAction = actionCreator.async<ProjectID, string>('Preview');
const previewWorker = wrapAsyncWorker<ProjectID, string, void>(
    PreviewAction, (params: ProjectID): Promise<string> => apiPreviewProject(params.name)
);

export const controlProject = {
    preview: (name: string) => (dispatch: Dispatch<AnyAction>) => previewWorker(dispatch, { name }),
};