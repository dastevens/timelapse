import { actionCreatorFactory } from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const SelectProjectAction = actionCreator<{projectName: string}>('SelectProject');