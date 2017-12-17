import * as React from 'react';
import {
    Button,
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
    deleteProject: (name: string) => void;
    selectProject: (project?: Project) => void;
}

const ToolbarButton = (props: { glyph: string, disabled?: boolean, onClick: () => void, confirm?: string }) => (
    <Button
        disabled={props.disabled}
        onClick={() => {
            if (props.confirm === undefined) {
                props.onClick();
            } else {
                if (confirm(props.confirm)) { props.onClick(); }
            }
        }}
    >
        <Glyphicon
            glyph={props.glyph}
        />
    </Button>
);

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
                    key={project.name}
                    bsStyle={getStatusValue(project.status, Setting.bsStyle)}
                >
                    <Glyphicon
                        glyph={getStatusValue(project.status, Setting.glyph)}
                    />
                    {project.name}
                    <ToolbarButton
                        glyph="cog"
                        onClick={() => props.selectProject(project)}
                    />
                    <ToolbarButton
                        glyph="remove"
                        disabled={!project.canDelete()}
                        onClick={() => props.deleteProject(project.name)}
                        confirm={'Are you sure you want to delete ' + project.name + '?'}
                    />
                </ListGroupItem>
            )
        }
    </ListGroup>
);