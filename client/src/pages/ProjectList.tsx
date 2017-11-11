import * as React from 'react';
import { Project } from '../model/Project';

class ProjectListProps {
    projects: Project[];
}

export class ProjectList extends React.Component<ProjectListProps> {

    render() {
        return (
            <ul>
                {this.props.projects.map(project => <li key={project.name}>{project.name}</li>)}
            </ul>
        );
    }
}
