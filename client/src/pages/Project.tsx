import * as React from 'react';
import {
    Button,
    ControlLabel,
    FormControl,
    FormGroup,
    Glyphicon,
} from 'react-bootstrap';

import {
    Project as ProjectModel,
    ProjectStatus
} from '../model/Project';

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
}

export class Project extends React.Component<ProjectProperties> {

    onSubmit() {
        console.log('onSubmit');
    }

    onStart() {
        console.log('onStart');
    }

    onPreview() {
        console.log('onStart');
    }

    render() {
        let project = this.props.project;
        return (
            <form>
                <FormGroup controlId='name'>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl value={project.name} />
                </FormGroup>

                <FormGroup controlId='description'>
                    <ControlLabel>Description</ControlLabel>
                    <FormControl value={project.description} />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Status</ControlLabel>
                    <FormControl.Static>
                        <Glyphicon glyph={getStatusValue(project.status, Setting.glyph)} />
                        {' '}
                        {getStatusValue(project.status, Setting.name)}
                    </FormControl.Static>
                </FormGroup>

                {
                    project.canEdit()
                        ?
                        <Button bsStyle="primary" onClick={e => { this.onSubmit() }}>
                            <Glyphicon glyph="save"/> Save
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
            </form>
        );
    }
}
