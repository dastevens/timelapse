import { connect } from 'react-redux';
import { StoreState } from '../redux/StoreState';
import {
    Fields,
    ProjectComponent
} from './ProjectComponent';

const mapStateToProps = (state: StoreState): Fields => ({
    project: state.project.project
});

export const ProjectContainer = connect(mapStateToProps)(ProjectComponent);