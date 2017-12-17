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
    Project,
    ProjectStatus
} from '../model/Project';

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

export interface Fields {
    project?: Project;
}

export interface Events {
    onNameChange: (name: string) => void;
    onDescriptionChange: (description: string) => void;
    onStartChange: (start: Date) => void;
    onImagesChange: (images: number) => void;
    onIntervalChange: (interval: number) => void;
}

const EditControl = (props: {name: string, type: string, value: string, onChange: (value: string) => void}) => (
    <FormGroup>
        <ControlLabel>{props.name}</ControlLabel>
        <FormControl
            onChange={(event) => props.onChange((event.target as any).value as string)}
            type={props.type}
            value={props.value}
        />
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

const pad = (value: number): string => (value < 10 ? '0' : '') + value;
const dateToValue = (date: Date): string => {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
};
const timeToValue = (date: Date): string => {
    return pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
};

const valueToDate = (dateString: string, timeString: string): Date => {
    var year = parseInt(dateString.substr(0, 4), 0);
    var month = parseInt(dateString.substr(5, 2), 0);
    var date = parseInt(dateString.substr(8, 2), 0);
    var hour = parseInt(timeString.substr(0, 2), 0);
    var minute = parseInt(timeString.substr(3, 2), 0);
    var second = parseInt(timeString.substr(6, 2), 0);
    return new Date(year, month - 1, date, hour, minute, second);
};

export const ProjectComponent = (props: Fields & Events) => {

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
                    <EditControl
                        name="Name"
                        onChange={(name) => props.onNameChange(name)}
                        type="input"
                        value={project.name}
                    />
                    <EditControl
                        name="Description"
                        onChange={(name) => props.onDescriptionChange(name)}
                        type="input"
                        value={project.description}
                    />
                    <EditControl
                        name="Start date"
                        onChange={(dateString) => props.onStartChange(
                            valueToDate(dateString, timeToValue(project.start)))}
                        type="date"
                        value={dateToValue(project.start)}
                    />
                    <EditControl
                        name="Start time"
                        onChange={(timeString) => props.onStartChange(
                            valueToDate(dateToValue(project.start), timeString))}
                        type="time"
                        value={timeToValue(project.start)}
                    />
                    <EditControl
                        name="Number of images"
                        onChange={(imagesString) => props.onImagesChange(parseInt(imagesString, 0))}
                        type="number"
                        value={project.images.toString()}
                    />
                    <EditControl
                        name="Interval (s)"
                        onChange={(intervalString) => props.onIntervalChange(parseInt(intervalString, 0))}
                        type="number"
                        value={project.interval.toString()}
                    />
                    <StaticControl
                        name="End"
                        value={project.getEnd().toLocaleString()}
                    />
                    <StaticControl
                        name="Total time (s)"
                        value={project.getTotalInterval().toString()}
                    />
                    <ButtonControl
                        enabled={project.canEdit()}
                        glyph="save"
                        label="Save"
                        style="primary"
                    />
                    <ButtonControl
                        enabled={project.canCopy()}
                        glyph="duplicate"
                        label="Copy"
                        style="primary"
                    />
                    <ButtonControl
                        enabled={project.canPreview()}
                        glyph="camera"
                        label="Preview"
                        style="warning"
                    />
                    <ButtonControl
                        enabled={project.canStart()}
                        glyph="play"
                        label="Start"
                        style="danger"
                    />
                    <ButtonControl
                        enabled={project.canStop()}
                        glyph="stop"
                        label="Stop"
                        style="danger"
                    />
                    <ButtonControl
                        enabled={project.canDelete()}
                        glyph="trash"
                        label="Delete"
                        style="danger"
                    />
                </form>
            </Panel>
        );
    }
};
