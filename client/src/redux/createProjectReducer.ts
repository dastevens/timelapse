import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
    SetCreateProjectNameAction
} from '../redux/CreateProjectAction';
import { CreateProjectState } from './StoreState';

export const createProjectReducer = reducerWithInitialState<CreateProjectState>({
    name: 'New...',
})
    .case(SetCreateProjectNameAction, (state: CreateProjectState, payload: { name: string }) => ({
        ...state,
        name: payload.name,
    }))
;