import { connect, Dispatch } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import { StoreState } from '../redux/StoreState';
import {
    Events,
    Fields,
    ProjectComponent
} from './ProjectComponent';
import { deleteProject } from '../redux/DeleteProjectAction';
import { editProject } from '../redux/EditProjectAction';
import { saveProject } from '../redux/SaveProjectAction';
import { controlProject } from '../redux/ControlProjectAction';
import { copyProject } from '../redux/CopyProjectAction';

const mapStateToProps = (state: StoreState): Fields => ({
    project: state.project.project,
    privewUrl: state.project.previewUrl,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): Events => {
    return {
        onCopy: project => dispatch(copyProject(project)),
        onDelete: projectName => dispatch(deleteProject(projectName)),
        onDescriptionChange: description => dispatch(editProject.setDescription(description)),
        onDismissPreview: () => dispatch(editProject.dismissPreview()),
        onImagesChange: images => dispatch(editProject.setImages(images)),
        onIntervalChange: interval => dispatch(editProject.setInterval(interval)),
        onNameChange: name => dispatch(editProject.setName(name)),
        onPreview: name => dispatch(controlProject.preview(name)),
        onSave: project => dispatch(saveProject(project)),
        onStart: projectName => dispatch(controlProject.start(projectName)),
        onStartChange: start => dispatch(editProject.setStart(start)),
        onStop: projectName => dispatch(controlProject.stop(projectName)),
    };
};

export const ProjectContainer = connect(mapStateToProps, mapDispatchToProps)(ProjectComponent);