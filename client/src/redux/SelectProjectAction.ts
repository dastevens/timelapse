import { actionCreatorFactory } from 'typescript-fsa';
import { Project } from '../model/Project';

const actionCreator = actionCreatorFactory();

export const SelectProjectAction = actionCreator<{ project?: Project }>('SelectProject');

export const selectProject = (project?: Project) => SelectProjectAction({ project });