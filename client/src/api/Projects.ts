import {
    Project,
    ProjectStatus
} from '../model/Project';

class ApiProject implements Project {
    constructor(
        public readonly name: string,
        public readonly description: string = '',
        public readonly status: ProjectStatus = ProjectStatus.Setup,
        public readonly start: Date = new Date(),
        public readonly images: number = 1000,
        public readonly interval: number = 1
    ) { }
}

let projects: Project[] = [
    new ApiProject(
        'Thor',
        'Rosa drawing Thor speeded up',
        ProjectStatus.Completed,
        new Date(2017, 9, 20),
        1000,
        1
    ),
    new ApiProject(
        'Cloud test',
        'Try clouds in the garden',
        ProjectStatus.Completed,
        new Date(2017, 9, 30),
        1000,
        1
    ),
];

export function getProjectList(): Promise<Project[]> {
    return new Promise<Project[]>((resolve, reject) => {
        setTimeout(
            () => resolve(projects),
            1000
        );
    });
}

export function createProject(name: string): Promise<Project> {
    return new Promise<Project>((resolve, reject) => {
        // Refuse if name already exists
        if (projects.find(p => p.name === name)) {
            reject('A project with name ' + name + ' already exists');
        } else {
            setTimeout(
                () => {
                    let newProject = new ApiProject(name);
                    let newProjects = projects.map(p => p);
                    newProjects.push(newProject);
                    projects = newProjects;
                    resolve(newProject);
                },
                500
            );
        }
    });
}

export function updateProject(project: Project): Promise<Project> {
    return new Promise<Project>((resolve, reject) => {
        setTimeout(
            () => {
                let updatedProject = {...project};
                projects = projects.map(p =>
                    p.name === updatedProject.name ? updatedProject : p
                );
                resolve(updatedProject);
            },
            500
        );
    });
}

export function copyProject(project: Project): Promise<Project> {
    return new Promise<Project>((resolve, reject) => {
        setTimeout(
            () => {
                // Rename with a number at the end
                let i = 1;
                let name = project.name;
                while (projects.find(p => p.name === name)) {
                    name = project.name + i++;
                }
                let newProject = new ApiProject(
                    name,
                    project.description,
                    ProjectStatus.Setup,
                    project.start,
                    project.images,
                    project.interval
                );
                let newProjects = projects.map(p => p);
                newProjects.push(newProject);
                projects = newProjects;
                resolve(newProject);
            },
            500
        );
    });
}

export function deleteProject(name: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(
            () => {
                projects = projects.filter(p => p.name !== name);
                resolve();
            },
            800
        );
    });
}

export function previewProject(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        setTimeout(
            () => {
                resolve('preview.jpg');
            },
            600
        );
    });
}

export function startProject(name: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(
            () => {
                resolve();
            },
            1200
        );
    });
}

export function stopProject(name: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(
            () => {
                resolve();
            },
            200
        );
    });
}
