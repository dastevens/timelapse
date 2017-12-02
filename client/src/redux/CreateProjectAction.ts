import { actionCreatorFactory } from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const CreateProjectAction = actionCreator<{}>('CreateProject');

export const createProject = () => CreateProjectAction({});