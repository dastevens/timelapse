import { actionCreatorFactory } from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const SetProjectNameAction = actionCreator<{ name: string }>('SetProjectName');
export const SetProjectDescriptionAction = actionCreator<{ description: string }>('SetProjectDescription');
export const SetProjectStartAction = actionCreator<{ start: Date }>('SetProjectStart');
export const SetProjectImagesAction = actionCreator<{ images: number }>('SetProjectImages');
export const SetProjectIntervalAction = actionCreator<{ interval: number }>('SetProjectInterval');

export const editProject = {
    setName: (name: string) => SetProjectNameAction({ name }),
    setDescription: (description: string) => SetProjectDescriptionAction({ description }),
    setStart: (start: Date) => SetProjectStartAction({ start }),
    setImages: (images: number) => SetProjectImagesAction({ images }),
    setInterval: (interval: number) => SetProjectIntervalAction({ interval }),
};