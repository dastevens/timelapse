import * as React from 'react';
import {
    Nav,
    Navbar,
    NavDropdown,
    NavItem,
    MenuItem,
} from 'react-bootstrap';

import { Project } from './model/Project';

class NavigationProps {
    projects: Project[];
}

export const Navigation = (props: NavigationProps) => (
    <Navbar inverse={true} collapseOnSelect={true}>
        <Navbar.Header>
            <Navbar.Brand>Timelapse</Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <NavItem>Projects</NavItem>
                <NavDropdown title="Select a project" id="nav-dropdown-projects">
                    {
                        props.projects.map(project =>
                            <MenuItem key={project.name}>
                                {project.name}
                            </MenuItem>
                        )
                    }
                </NavDropdown>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);