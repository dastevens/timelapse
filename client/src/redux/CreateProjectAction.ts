import { createProject as apiCreateProject } from '../api/Projects';
import { Dispatch } from 'react-redux';
import { actionCreatorFactory, AnyAction } from 'typescript-fsa';
import wrapAsyncWorker from './wrapAsyncWorker';
import { Project } from '../model/Project';

const actionCreator = actionCreatorFactory();

export interface CreateProjectParams {
    name: string;
}
export const CreateProjectAction = actionCreator.async<CreateProjectParams, Project>('CreateProject');

const createProjectsWorker = wrapAsyncWorker<CreateProjectParams, Project, string>(
    CreateProjectAction,
    (params: CreateProjectParams): Promise<Project> =>
        apiCreateProject(params.name)
);

export const SetCreateProjectNameAction = actionCreator<{ name: string }>('SetCreateProjectName');

export const createProject = {
    setName: (name: string) => SetCreateProjectNameAction({ name }),
    create: (name: string) => {
        return (dispatch: Dispatch<AnyAction>) => createProjectsWorker(dispatch, {name});
    },
};