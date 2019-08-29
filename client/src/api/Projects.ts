import {
    Project,
    ProjectStatus
} from '../model/Project';

const apiUrl: string = 'https://localhost:44340/api';

interface IApiProject {
    projectId: {
        name: string;
    };
    description: string;
    start: string;
    images: number;
    interval: string;
}

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

function FromApi(apiProject: IApiProject): Project {
    return new ApiProject(
        apiProject.projectId.name,
        apiProject.description,
        ProjectStatus.Setup,
        new Date(apiProject.start),
        apiProject.images,
        TimeSpanToSeconds(apiProject.interval)
    );
}

function TimeSpanToSeconds(timeSpan: string): number {
    return 1;
}

export function getProjectList(): Promise<Project[]> {

    return fetch(apiUrl + '/projects')
        .then(response => {
            if (response.status !== 200) {
                throw response.statusText;
            }
            // Convert to JSON
            return response.json();
        })
        .then(value => {
            return (value as IApiProject[]).map(p => FromApi(p));
        });
}

export function createProject(name: string): Promise<Project> {

    var project: IApiProject = {
        description: '',
        images: 1,
        interval: '0:0:1',
        projectId: {
            name: name
        },
        start: '2100-01-01'
    };

    return fetch(apiUrl + '/projects/' + name, {
        method: 'POST',
    })
        .then(response => {
            if (response.status !== 200) {
                throw response.statusText;
            }
            return FromApi(project);
        });
}

export function updateProject(project: Project): Promise<Project> {
    throw 'Not implemented';
}

export function copyProject(project: Project): Promise<Project> {
    throw 'Not implemented';
}

export function deleteProject(name: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        return fetch(apiUrl + '/projects/' + name, {
            method: 'DELETE'
        });
    });
}

export function previewProject(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        resolve(apiUrl + '/preview?' + Math.random());
    });
}
