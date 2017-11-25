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
} from './Project';

interface ProjectListProps {
    projects: Project[];
}

export const ProjectList = (props: ProjectListProps) => {

    return (
        <ListGroup>
            {
                props.projects.map(project =>
                    <ListGroupItem
                        key={project.name}
                        bsStyle={getStatusValue(project.status, Setting.bsStyle)}
                    >
                        <Glyphicon glyph={getStatusValue(project.status, Setting.glyph)} /> {project.name}
                    </ListGroupItem>
                )
            }
        </ListGroup>
    );
};