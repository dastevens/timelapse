import * as React from 'react';
import {
    ProjectList
} from '../Routes';

export class Home extends React.Component {
    render() {
        return (
            <div>
                <p>View the list of projects to get started</p>
                <a href={ProjectList.url()}>Projects</a>
            </div>
        );
    }
}
