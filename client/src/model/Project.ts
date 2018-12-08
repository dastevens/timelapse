export enum ProjectStatus {
    Setup,
    Capturing,
    Completed
}

export interface ProjectID {
    name: string;
}

export class Project implements ProjectID {
    constructor(
        public readonly name: string,
        public readonly description: string = '',
        public readonly status: ProjectStatus = ProjectStatus.Setup,
        public readonly start: Date = new Date(),
        public readonly images: number = 1000,
        public readonly interval: number = 1
    ) { }

    canEdit() {
        return this.status === ProjectStatus.Setup;
    }

    canStart() {
        return this.status === ProjectStatus.Setup;
    }

    canStop() {
        return this.status === ProjectStatus.Capturing;
    }

    canPreview() {
        return this.status === ProjectStatus.Setup;
    }

    canDelete() {
        return this.status !== ProjectStatus.Capturing;
    }

    canCopy() {
        return true;
    }

    isCapturing() {
        return this.status === ProjectStatus.Capturing;
    }

    isCompleted() {
        return this.status === ProjectStatus.Completed;
    }

    getEnd(): Date {
        return new Date(this.start.getTime() + this.images * this.interval * 1000);
    }

    getTotalInterval(): number {
        return this.images * this.interval;
    }

    getProgress(): number {
        let now = new Date().getTime();
        if (now < this.start.getTime()) { return 0; }
        if (now > this.getEnd().getTime()) { return 1; }
        return (now - this.start.getTime()) / (this.getTotalInterval() * 1000);
    }
}