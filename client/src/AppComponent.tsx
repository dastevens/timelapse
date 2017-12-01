import * as React from 'react';
import './App.css';
import { NavigationContainer } from './NavigationContainer';
import { ProjectListContainer } from './pages/ProjectListContainer';
import { ProjectContainer } from './pages/ProjectContainer';

export interface Fields {
    projectName?: string;
}
interface Events {
}

export const AppComponent = (props: Fields & Events) => (
    <div className="App">
        <NavigationContainer />
        {props.projectName === undefined ? <ProjectListContainer /> : null}
        {props.projectName !== undefined ? <ProjectContainer /> : null}
    </div>
);
