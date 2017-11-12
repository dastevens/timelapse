import * as React from 'react';
import {
    Button,
    ControlLabel,
    FormControl,
    FormGroup,
    Glyphicon,
    Panel,
    ProgressBar,
} from 'react-bootstrap';

import {
    navigateTo,
    Project as ProjectRoute,
    ProjectList as ProjectListRoute,
} from '../Routes';

import {
    Project as ProjectModel,
    ProjectStatus
} from '../model/Project';

import {
    copyProject,
    deleteProject,
} from '../api/Projects';

interface IStatusSettings {
    bsStyle: string;
    glyph: string;
    name: string;
}

let statusLookup: { [status: number]: IStatusSettings; } = {};
statusLookup[ProjectStatus.Setup] = { bsStyle: 'warning', glyph: 'cog', name: 'Setup', };
statusLookup[ProjectStatus.Capturing] = { bsStyle: 'danger', glyph: 'flash', name: 'Capturing', };
statusLookup[ProjectStatus.Completed] = { bsStyle: 'success', glyph: 'ok', name: 'Completed', };

export enum Setting {
    bsStyle,
    glyph,
    name,
}
export function getStatusValue(status: ProjectStatus, setting: Setting): string {
    var settings = statusLookup[status];
    switch (setting) {
        case Setting.bsStyle: return settings.bsStyle;
        case Setting.glyph: return settings.glyph;
        case Setting.name: return settings.name;
        default: return '';
    }
}

class ProjectProperties {
    project: ProjectModel;
    refreshProjectList: () => Promise<void>;
}

export class Project extends React.Component<ProjectProperties> {

    private onSave() {
        console.log('onSave');
    }

    private onCopy() {
        console.log('onCopy');
        copyProject(this.props.project)
            .then(projectName =>
                this.props.refreshProjectList()
                    .then(() => navigateTo(ProjectRoute.url(projectName)))
            );
    }

    private onStart() {
        console.log('onStart');
    }

    private onStop() {
        console.log('onStop');
    }

    private onDelete() {
        console.log('onCopy');
        deleteProject(this.props.project.name)
            .then(() =>
                this.props.refreshProjectList()
                    .then(() => navigateTo(ProjectListRoute.url()))
            );
    }

    private onPreview() {
        console.log('onPreview');
    }

    render() {
        let project = this.props.project;
        return (
            <Panel
                header={
                    <div><Glyphicon glyph={getStatusValue(project.status, Setting.glyph)} />
                    {' '}
                    {getStatusValue(project.status, Setting.name)}
                    {' '}
                    <ProgressBar
                        striped={true}
                        bsStyle={getStatusValue(project.status, Setting.bsStyle)}
                        active={project.status === ProjectStatus.Capturing}
                        now={project.getProgress() * 100} />
                    </div>
                }
                bsStyle={getStatusValue(project.status, Setting.bsStyle)}>

            <form>

                <FormGroup>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl value={project.name} />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Description</ControlLabel>
                    <FormControl value={project.description} />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Start</ControlLabel>
                    <FormControl value={project.start.toLocaleString()} />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Number of images</ControlLabel>
                    <FormControl value={project.images} />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Interval (s)</ControlLabel>
                    <FormControl value={project.interval} />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>End</ControlLabel>
                    <FormControl.Static>
                        {project.getEnd().toLocaleString()}
                    </FormControl.Static>
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Total time (s)</ControlLabel>
                    <FormControl.Static>
                        {project.getTotalInterval()}
                    </FormControl.Static>
                </FormGroup>

                {
                    project.canEdit()
                        ?
                        <Button bsStyle="primary" onClick={e => { this.onSave() }}>
                            <Glyphicon glyph="save"/> Save
                        </Button>
                        :
                        null
                }

                {
                    project.canCopy()
                        ?
                        <Button bsStyle="primary" onClick={e => { this.onCopy() }}>
                            <Glyphicon glyph="duplicate" /> Copy
                        </Button>
                        :
                        null
                }

                {
                    project.canPreview()
                        ?
                        <Button bsStyle="warning" onClick={e => { this.onPreview() }}>
                            <Glyphicon glyph="camera" /> Preview
                        </Button>
                        :
                        null
                }

                {
                    project.canStart()
                        ?
                        <Button bsStyle="danger" onClick={e => { this.onStart() }}>
                            <Glyphicon glyph="play"/> Start
                        </Button>
                        :
                        null
                }

                {
                    project.canStop()
                        ?
                        <Button bsStyle="danger" onClick={e => { this.onStop() }}>
                            <Glyphicon glyph="stop" /> Stop
                        </Button>
                        :
                        null
                }

                {
                    project.canDelete()
                        ?
                        <Button bsStyle="danger" onClick={e => { this.onDelete() }}>
                            <Glyphicon glyph="trash" /> Delete
                        </Button>
                        :
                        null
                }
            </form>
            </Panel>
        );
    }
}
