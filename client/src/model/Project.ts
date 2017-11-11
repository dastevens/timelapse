export enum ProjectStatus {
    Setup,
    Capturing,
    Completed
}

export class Project {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly status: ProjectStatus
    ) { }

    canEdit() {
        return this.status === ProjectStatus.Setup;
    }

    canStart() {
        return this.status === ProjectStatus.Setup;
    }

    canPreview() {
        return this.status === ProjectStatus.Setup;
    }

    isCapturing() {
        return this.status === ProjectStatus.Capturing;
    }

    isCompleted() {
        return this.status === ProjectStatus.Completed;
    }
}