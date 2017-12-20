import * as React from 'react';
import {
    Glyphicon,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap';
import {
    Project,
    ProjectStatus
} from '../model/Project';
import {
    getStatusValue,
    Setting,
} from './ProjectComponent';

export interface Fields {
    projects: Project[];
}

export interface Events {
    createProject: () => void;
    selectProject: (project?: Project) => void;
}

export const ProjectListComponent = (props: Fields & Events) => (
    <ListGroup>
        <ListGroupItem
            key=""
            onClick={() => props.createProject()}
            bsStyle={getStatusValue(ProjectStatus.Setup, Setting.bsStyle)}
        >
            <Glyphicon glyph={getStatusValue(ProjectStatus.Setup, Setting.glyph)} /> New Project...
        </ListGroupItem>
        {
            props.projects.map(project =>
                <ListGroupItem
                    bsStyle={getStatusValue(project.status, Setting.bsStyle)}
                    key={project.name}
                    onClick={() => props.selectProject(project)}
                >
                    <Glyphicon
                        glyph={getStatusValue(project.status, Setting.glyph)}
                    />&nbsp;
                    {project.name}
                </ListGroupItem>
            )
        }
    </ListGroup>
);