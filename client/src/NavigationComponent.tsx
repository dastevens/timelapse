import * as React from 'react';
import {
    Nav,
    Navbar,
    NavDropdown,
    NavItem,
    MenuItem,
} from 'react-bootstrap';

import { Project } from './model/Project';

export interface Fields {
    projects: Project[];
}
export interface Events {
    selectProject: (project?: Project) => void;
}

export const NavigationComponent = (props: Fields & Events) => (
    <Navbar inverse={true} collapseOnSelect={true}>
        <Navbar.Header>
            <Navbar.Brand>Timelapse</Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <NavItem onClick={() => props.selectProject(undefined)}>Projects</NavItem>
                <NavDropdown title="Select a project" id="nav-dropdown-projects">
                    {
                        props.projects.map(project =>
                            <MenuItem onClick={() => props.selectProject(project)} key={project.name}>
                                {project.name}
                            </MenuItem>
                        )
                    }
                </NavDropdown>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);