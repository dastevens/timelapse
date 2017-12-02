import { Project } from '../model/Project';

export type ProjectListState = {
    errorMessage: string;
    projects: Project[];
    loading: boolean;
};

export type ProjectState = {
    project?: Project;
};

export type StoreState = {
    project: ProjectState;
    projectList: ProjectListState;
}