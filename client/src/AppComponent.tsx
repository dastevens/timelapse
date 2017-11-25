import * as React from 'react';
import { Project } from './model/Project';
import { LoadingState } from './model/LoadingState';
import './App.css';
import { Navigation } from './Navigation';
import { ProjectList as ProjectListPage } from './pages/ProjectList';
import { Project as ProjectPage } from './pages/Project';

export interface AppProps {
    projects: Project[];
    loadingState: LoadingState;
    projectName: string;
}

export const AppComponent = (props: AppProps) => (
    <div className="App">
        <Navigation projects={props.projects} />
        <pre>{props.projects}</pre>
        <pre>{props.loadingState}</pre>
        <pre>{props.projectName}</pre>
        <ProjectListPage projects={props.projects} />
        <ProjectPage project={props.projects.find(project => project.name.localeCompare(props.projectName) === 0)} />
    </div>
);
