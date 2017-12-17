import { deleteProject as apiDeleteProject } from '../api/Projects';
import { Dispatch } from 'react-redux';
import { actionCreatorFactory, AnyAction } from 'typescript-fsa';
import wrapAsyncWorker from './wrapAsyncWorker';

const actionCreator = actionCreatorFactory();

export interface DeleteProjectParams {
    projectName: string;
}
export const DeleteProjectAction = actionCreator.async<DeleteProjectParams, string>('DeleteProject');

const deleteProjectsWorker = wrapAsyncWorker<DeleteProjectParams, string, void>(
    DeleteProjectAction,
    (params: DeleteProjectParams): Promise<string> =>
        apiDeleteProject(params.projectName)
            .then(() => params.projectName)
);

export const deleteProject = (projectName: string) => {
    return (dispatch: Dispatch<AnyAction>) => deleteProjectsWorker(dispatch, {projectName});
};