import { Project } from '../model/Project';
import { getQueue } from '../api/Projects';
import { Dispatch } from 'react-redux';
import { actionCreatorFactory, AnyAction } from 'typescript-fsa';
import wrapAsyncWorker from './wrapAsyncWorker';

const actionCreator = actionCreatorFactory();

export const LoadProjectsAction = actionCreator.async<null, Project[]>('LoadProjects');

const loadProjectsWorker =
    wrapAsyncWorker(LoadProjectsAction, (): Promise<Project[]> => getQueue());

export const loadProjects = () => {
    return (dispatch: Dispatch<AnyAction>) => loadProjectsWorker(dispatch, null);
};