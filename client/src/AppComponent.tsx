import * as React from 'react';
import './App.css';
import { NavigationContainer } from './NavigationContainer';
import { ProjectListContainer } from './pages/ProjectListContainer';
import { ProjectContainer } from './pages/ProjectContainer';
import { Project } from './model/Project';

export interface Fields {
    project?: Project;
}
interface Events {
}

export const AppComponent = (props: Fields & Events) => (
    <div className="App">
        <NavigationContainer />
        {props.project === undefined ? <ProjectListContainer /> : null}
        {props.project !== undefined ? <ProjectContainer /> : null}
    </div>
);
