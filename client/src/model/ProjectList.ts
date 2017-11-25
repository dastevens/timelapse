import { LoadingState } from './LoadingState'
import { Project } from './Project'

export interface ProjectList {
    loadingState: LoadingState;
    error: string;
    projects: Project[];
}