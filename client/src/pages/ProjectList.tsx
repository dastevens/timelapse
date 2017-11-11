import * as React from 'react';
import {
    Glyphicon,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap';
import { Project as ProjectRoute } from '../Routes';
import {
    Project,
} from '../model/Project';
import {
    getStatusValue,
    Setting,
} from './Project';

class ProjectListProps {
    projects: Project[];
}

export class ProjectList extends React.Component<ProjectListProps> {

    render() {
        return (
            <ListGroup>
                {
                    this.props.projects.map(project =>
                        <ListGroupItem key={project.name} bsStyle={getStatusValue(project.status, Setting.bsStyle)} href={ProjectRoute.url(project.name)}>
                            <Glyphicon glyph={getStatusValue(project.status, Setting.glyph)} /> {project.name}
                        </ListGroupItem>
                    )
                }
            </ListGroup>
        );
    }
}
