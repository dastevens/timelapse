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
    Project as ProjectModel,
    ProjectStatus
} from '../model/Project';

import {

} from '../model/Reducers';

interface StatusSettings {
    bsStyle: string;
    glyph: string;
    name: string;
}

let statusLookup: { [status: number]: StatusSettings; } = {};
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
    project?: ProjectModel;
}

const EditControl = (props: {name: string, value: string}) => (
    <FormGroup>
        <ControlLabel>{props.name}</ControlLabel>
        <FormControl value={props.value} />
    </FormGroup>
);

const StaticControl = (props: {name: string, value: string}) => (
    <FormGroup>
        <ControlLabel>{props.name}</ControlLabel>
        <FormControl.Static>{props.value}</FormControl.Static>
    </FormGroup>
);

const ButtonControl = (props: {label: string, enabled: boolean, glyph: string, style: string}) => (
    <Button disabled={!props.enabled} bsStyle={props.style}>
        <Glyphicon glyph={props.glyph}/> {props.label}
    </Button>
);

export const Project = (props: ProjectProperties) => {

    const project = props.project;
    if (project === undefined) {
        return null;
    } else {
        return (
            <Panel
                header={<div><Glyphicon glyph={getStatusValue(project.status, Setting.glyph)} />
                        {' '}
                        {getStatusValue(project.status, Setting.name)}
                        {' '}
                        <ProgressBar
                            striped={true}
                            bsStyle={getStatusValue(project.status, Setting.bsStyle)}
                            active={project.status === ProjectStatus.Capturing}
                            now={project.getProgress() * 100}
                        />
                    </div>}
                bsStyle={getStatusValue(project.status, Setting.bsStyle)}
            >

                <form>
                    <EditControl name="Name" value={project.name} />
                    <EditControl name="Description" value={project.description} />
                    <EditControl name="Start" value={project.start.toLocaleString()} />
                    <EditControl name="Number of images" value={project.images.toString()} />
                    <EditControl name="Interval (s)" value={project.interval.toString()} />
                    <StaticControl name="End" value={project.getEnd().toLocaleString()} />
                    <StaticControl name="Total time (s)" value={project.getTotalInterval().toString()} />
                    <ButtonControl label="Save" enabled={project.canEdit()} glyph="save" style="primary" />
                    <ButtonControl label="Copy" enabled={project.canCopy()} glyph="duplicate" style="primary" />
                    <ButtonControl label="Preview" enabled={project.canPreview()} glyph="camera" style="warning" />
                    <ButtonControl label="Start" enabled={project.canStart()} glyph="play" style="danger" />
                    <ButtonControl label="Stop" enabled={project.canStop()} glyph="stop" style="danger" />
                    <ButtonControl label="Delete" enabled={project.canDelete()} glyph="trash" style="danger" />
                </form>
            </Panel>
        );
    }
};
