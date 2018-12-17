export enum ProjectStatus {
    Setup,
    Capturing,
    Completed
}

export interface ProjectID {
    name: string;
}

export interface Project extends ProjectID {
    readonly description: string;
    readonly status: ProjectStatus;
    readonly start: Date;
    readonly images: number;
    readonly interval: number;
}

export function canEdit(project: Project) {
    return project.status === ProjectStatus.Setup;
}

export function canStart(project: Project) {
    return project.status === ProjectStatus.Setup;
}

export function canStop(project: Project) {
    return project.status === ProjectStatus.Capturing;
}

export function canPreview(project: Project) {
    return project.status === ProjectStatus.Setup;
}

export function canDelete(project: Project) {
    return project.status !== ProjectStatus.Capturing;
}

export function canCopy(project: Project) {
    return true;
}

export function isCapturing(project: Project) {
    return project.status === ProjectStatus.Capturing;
}

export function isCompleted(project: Project) {
    return project.status === ProjectStatus.Completed;
}

export function getEnd(project: Project): Date {
    return new Date(project.start.getTime() + project.images * project.interval * 1000);
}

export function getTotalInterval(project: Project): number {
    return project.images * project.interval;
}

export function getProgress(project: Project): number {
    let now = new Date().getTime();
    if (now < project.start.getTime()) { return 0; }
    if (now > getEnd(project).getTime()) { return 1; }
    return (now - project.start.getTime()) / (getTotalInterval(project) * 1000);
}