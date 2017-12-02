import { connect, Dispatch } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import { StoreState } from '../redux/StoreState';
import {
    Events,
    Fields,
    ProjectComponent
} from './ProjectComponent';
import { editProject } from '../redux/EditProjectAction';

const mapStateToProps = (state: StoreState): Fields => ({
    project: state.project.project
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): Events => {
    return {
        onNameChange: name => dispatch(editProject.setName(name)),
        onDescriptionChange: description => dispatch(editProject.setDescription(description)),
        onStartChange: start => dispatch(editProject.setStart(start)),
        onImagesChange: images => dispatch(editProject.setImages(images)),
        onIntervalChange: interval => dispatch(editProject.setInterval(interval)),
    };
};

export const ProjectContainer = connect(mapStateToProps, mapDispatchToProps)(ProjectComponent);