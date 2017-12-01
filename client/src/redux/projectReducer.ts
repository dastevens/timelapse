import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { SelectProjectAction } from './SelectProjectAction';

export type ProjectState = {
    projectName?: string;
};
  
export const projectReducer = reducerWithInitialState<ProjectState>({
    projectName: undefined,
})
    .case(SelectProjectAction, (state: ProjectState, payload: { projectName?: string }) => ({
        ...state,
        projectName: payload.projectName,
    }))
    ;