import { updateProject as apiSaveProject } from '../api/Projects';
import { Dispatch } from 'react-redux';
import { actionCreatorFactory, AnyAction } from 'typescript-fsa';
import wrapAsyncWorker from './wrapAsyncWorker';
import { Project } from '../model/Project';

const actionCreator = actionCreatorFactory();

export const SaveProjectAction = actionCreator.async<Project, void>('SaveProject');

const saveProjectWorker = wrapAsyncWorker<Project, void, void>(
    SaveProjectAction,
    (params: Project): Promise<void> =>
        apiSaveProject(params)
);

export const saveProject = (project: Project) => {
    return (dispatch: Dispatch<AnyAction>) => saveProjectWorker(dispatch, project);
};