import {
    Action,
    applyMiddleware,
    combineReducers,
    createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Project } from './Project';
import { LoadingState } from './LoadingState';
import { ProjectList } from './ProjectList';
import { getProjectList } from '../api/Projects';

export const ACTIONS = {
    LOAD_PROJECTS: 'LOAD_PROJECTS',
    LOAD_PROJECTS_SUCCESS: 'LOAD_PROJECTS_SUCCESS',
    LOAD_PROJECTS_FAILURE: 'LOAD_PROJECTS_FAILURE',
};

export const fetchProjects = () => {
    return function (dispatch: ((action: Action) => void)) {
        dispatch(loadProjectsRequest());
        // Call the api asynchronously
        getProjectList().then(
            projects => dispatch(loadProjectsSuccess(projects)),
            error => dispatch(loadProjectsFailure(error.toString()))
        );
    };
};

export const loadProjectsRequest = () => {
    return {
        type: ACTIONS.LOAD_PROJECTS
    };
};

interface LoadProjectsSuccessAction extends Action {
    projects: Project[];
}

export const loadProjectsSuccess = (projects: Project[]) => {
    return {
        type: ACTIONS.LOAD_PROJECTS_SUCCESS,
        projects: projects,
    };
};

interface LoadProjectsFailureAction extends Action {
    error: string;
}

export const loadProjectsFailure = (error: string) => {
    return {
        type: ACTIONS.LOAD_PROJECTS_FAILURE,
        error: error,
    };
};

function projectList(state = { projects: [], error: '', loadingState: LoadingState.Init }, action: Action): ProjectList {
    switch (action.type) {
        case ACTIONS.LOAD_PROJECTS:
            return {
                projects: [],
                error: '',
                loadingState: LoadingState.Loading,
            };
        case ACTIONS.LOAD_PROJECTS_SUCCESS:
            return {
                projects: (action as LoadProjectsSuccessAction).projects,
                error: '',
                loadingState: LoadingState.Ready,
            };
        case ACTIONS.LOAD_PROJECTS_FAILURE:
            return {
                projects: [],
                error: (action as LoadProjectsFailureAction).error,
                loadingState: LoadingState.Error,
            };
        default:
            return state;
    }
}

const reducer = combineReducers({ projectList });
export const store = createStore(
    reducer,
    applyMiddleware(
        thunkMiddleware,
    )
);