import * as React from 'react';
import {
    FormControl,
    Nav,
    Navbar,
    NavDropdown,
    NavItem,
    MenuItem,
} from 'react-bootstrap';

import { Project } from './model/Project';

export interface Fields {
    projects: Project[];
    createProjectName: string;
}
export interface Events {
    selectProject: (project?: Project) => void;
    createProject: (name: string) => void;
    setCreateProjectName: (name: string) => void;
}

export const NavigationComponent = (props: Fields & Events) => (
    <Navbar inverse={true} collapseOnSelect={true}>
        <Navbar.Header>
            <Navbar.Brand>Timelapse</Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <NavItem onClick={() => props.selectProject(undefined)}>
                    Projects
                </NavItem>
                <NavDropdown title="Select a project" id="nav-dropdown-projects">
                    {
                        props.projects.map(project =>
                            <MenuItem onClick={() => props.selectProject(project)} key={project.name}>
                                {project.name}
                            </MenuItem>
                        )
                    }
                </NavDropdown>
                <NavItem>
                    <FormControl
                        type="text"
                        value={props.createProjectName}
                        onChange={(event) => props.setCreateProjectName((event.target as any).value as string)}
                    />
                </NavItem>
                <NavItem onClick={() => props.createProject(props.createProjectName)}>
                    New
                </NavItem>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);