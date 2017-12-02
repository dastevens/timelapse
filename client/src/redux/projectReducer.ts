import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { SelectProjectAction } from './SelectProjectAction';
import { Project } from '../model/Project';
import { ProjectState } from './StoreState';

export const projectReducer = reducerWithInitialState<ProjectState>({
    project: undefined,
})
.case(SelectProjectAction, (state: ProjectState, payload: { project?: Project }) => ({
    ...state,
    project: payload.project,
}))
;