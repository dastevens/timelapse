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
        <FormControl type={props.type} value={props.value} onChange={(event) => props.onChange((event.target as any).value)} />
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

const pad = (value: number): string => (value < 10 ? "0" : "") + value;
const dateToValue = (date: Date): string => {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}
const timeToValue = (date: Date): string => {
    return pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
}

const valueToDate = (dateString: string, timeString: string): Date => {
    var year = parseInt(dateString.substr(0, 4));
    var month = parseInt(dateString.substr(5, 2));
    var date = parseInt(dateString.substr(8, 2));
    var hour = parseInt(timeString.substr(0, 2));
    var minute = parseInt(timeString.substr(3, 2));
    var second = parseInt(timeString.substr(6, 2));
    return new Date(year, month - 1, date, hour, minute, second);
}

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
                    <EditControl name="Name" type="input" value={project.name} onChange={(name) => props.onNameChange(name)} />
                    <EditControl name="Description" type="input" value={project.description} onChange={(name) => props.onDescriptionChange(name)} />
                    <EditControl name="Start date" type="date" value={dateToValue(project.start)} onChange={(dateString) => props.onStartChange(valueToDate(dateString, timeToValue(project.start)))} />
                    <EditControl name="Start time" type="time" value={timeToValue(project.start)} onChange={(timeString) => props.onStartChange(valueToDate(dateToValue(project.start), timeString))} />
                    <EditControl name="Number of images" type="number" value={project.images.toString()} onChange={(imagesString) => props.onImagesChange(parseInt(imagesString))} />
                    <EditControl name="Interval (s)" type="number" value={project.interval.toString()} onChange={(intervalString) => props.onIntervalChange(parseInt(intervalString))} />
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
