import * as React from 'react';
import {
    Glyphicon,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap';
import {
    Project,
} from '../model/Project';
import {
    getStatusValue,
    Setting,
} from './ProjectComponent';

export interface Fields {
    projects: Project[];
}

export interface Events {
    selectProject: (project?: Project) => void;
}

export const ProjectListComponent = (props: Fields & Events) => (
    <ListGroup>
        {
            props.projects.map(project =>
                <ListGroupItem
                    key={project.name}
                    onClick={() => props.selectProject(project)}
                    bsStyle={getStatusValue(project.status, Setting.bsStyle)}
                >
                    <Glyphicon glyph={getStatusValue(project.status, Setting.glyph)} /> {project.name}
                </ListGroupItem>
            )
        }
    </ListGroup>
);