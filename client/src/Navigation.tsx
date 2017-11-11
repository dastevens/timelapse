import * as React from 'react';
import {
    Nav,
    Navbar,
    NavDropdown,
    NavItem,
    MenuItem,
} from 'react-bootstrap';
import {
    Home as HomeRoute,
    navigateTo,
    Project as ProjectRoute,
    ProjectList as ProjectListRoute,
} from './Routes';

import { Project } from './model/Project';

class NavigationProps {
    projects: Project[];
}

export class Navigation extends React.Component<NavigationProps> {

    onHomeClick() {
        navigateTo(HomeRoute.url());
    }

    onProjectListClick() {
        navigateTo(ProjectListRoute.url());
    }

    onProjectClick(project: Project) {
        navigateTo(ProjectRoute.url(project.name));
    }

    render() {
        return (
            <Navbar inverse={true} collapseOnSelect={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a onClick={e => this.onHomeClick()} href={HomeRoute.url()}>Timelapse</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} onClick={e => this.onProjectListClick()} href={ProjectListRoute.url()}>Projects</NavItem>
                        <NavDropdown eventKey={2} title="Select a project" id="basic-nav-dropdown">
                            {
                                this.props.projects.map(project =>
                                    <MenuItem eventKey={2.1} onClick={e => this.onProjectClick(project)} href={ProjectRoute.url(project.name)}>
                                        {project.name}
                                    </MenuItem>
                                )
                            }
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
