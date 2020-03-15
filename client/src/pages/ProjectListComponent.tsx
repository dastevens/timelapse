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
    errorMessage: string,
    loading: boolean,
    projects: Project[];
}

export interface Events {
    createProject: () => void;
    selectProject: (project?: Project) => void;
}

export const ProjectListComponent = (props: Fields & Events) => (
    <ListGroup>
        {
            props.loading
            ? <ListGroupItem
                bsStyle='warning'>
                    <Glyphicon glyph='flash'
                    />&nbsp;
                    Loading projects...
                </ListGroupItem>
            : null
        }
        {
            props.errorMessage
            ? <ListGroupItem
                bsStyle='danger'>
                    <Glyphicon glyph='flash'
                    />&nbsp;
                    {props.errorMessage} 
                </ListGroupItem>
            : null
        }
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