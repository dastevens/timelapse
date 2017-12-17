import {
    Project,
    ProjectStatus
} from '../model/Project';

let projects = [
    new Project(
        'Thor',
        'Rosa drawing Thor speeded up',
        ProjectStatus.Completed,
        new Date(2017, 9, 20),
        1000,
        1
    ),
    new Project(
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

export function createProject(project: Project): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        // Refuse if name already exists
        if (projects.find(p => p.name === project.name)) {
            reject('A project with name ' + project.name + ' already exists');
        } else {
            setTimeout(
                () => {
                    let newProjects = projects.map(p => p);
                    newProjects.push(project);
                    projects = newProjects;
                    resolve(project.name);
                },
                500
            );
        }
    });
}

export function updateProject(project: Project): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(
            () => {
                projects = projects.map(p =>
                    p.name === project.name ? project : p
                );
                resolve();
            },
            500
        );
    });
}

export function copyProject(project: Project): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        setTimeout(
            () => {
                // Rename with a number at the end
                let i = 1;
                let name = project.name;
                while (projects.find(p => p.name === name)) {
                    name = project.name + i++;
                }
                let newProjects = projects.map(p => p);
                newProjects.push(
                    new Project(
                        name,
                        project.description,
                        ProjectStatus.Setup,
                        project.start,
                        project.images,
                        project.interval
                    )
                );
                projects = newProjects;
                resolve(name);
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