import { Project } from '../model/Project';

export type CreateProjectState = {
    name: string;
};

export type ProjectListState = {
    errorMessage: string;
    projects: Project[];
    loading: boolean;
};

export type ProjectState = {
    project?: Project;
    previewUrl?: string;
};

export type StoreState = {
    createProject: CreateProjectState;
    project: ProjectState;
    projectList: ProjectListState;
}