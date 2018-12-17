import { copyProject as apiCopyProject } from '../api/Projects';
import { Dispatch } from 'react-redux';
import { actionCreatorFactory, AnyAction } from 'typescript-fsa';
import wrapAsyncWorker from './wrapAsyncWorker';
import { Project } from '../model/Project';

const actionCreator = actionCreatorFactory();

export const CopyProjectAction = actionCreator.async<Project, Project>('CopyProject');

const copyProjectWorker = wrapAsyncWorker<Project, Project, void>(
    CopyProjectAction,
    (params: Project): Promise<Project> =>
        apiCopyProject(params)
);

export const copyProject = (project: Project) => {
    return (dispatch: Dispatch<AnyAction>) => copyProjectWorker(dispatch, project);
};