import {
    Project,
    ProjectStatus
} from '../model/Project';

const apiUrl: string = '/api';

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
        public readonly start: Date = new Date('2100-01-01'),
        public readonly images: number = 1000,
        public readonly interval: number = 1
    ) { }
}

function FromApi(apiProject: IApiProject): Project {
    return new ApiProject(
        apiProject.projectId.name,
        apiProject.description,
        ProjectStatus.Setup,
        StringToDate(apiProject.start),
        apiProject.images,
        TimeSpanToSeconds(apiProject.interval)
    );
}

function ToApi(project: Project): IApiProject {
    return {
      projectId: {
          name: project.name,
      },
      description: project.description,
      start: DateToString(project.start),
      images: project.images,
      interval: SecondsToTimeSpan(project.interval),
    };
}

function DateToString(date: Date): string {
    return '2100-01-01';
}

function StringToDate(string: string): Date {
    return new Date(string);
}

function TimeSpanToSeconds(timeSpan: string): number {
    return 1;
}

function SecondsToTimeSpan(seconds: number): string {
    return '00:00:01';
}

export function getProjectList(): Promise<Project[]> {

    return fetch(apiUrl + '/projects')
        .then(response => {
            if (response.status !== 200) {
                throw response.statusText;
            }
            return response.json();
        })
        .then(value => {
            return (value as IApiProject[]).map(p => FromApi(p));
        });
}

export function createProject(name: string): Promise<Project> {

    var project = ToApi(new ApiProject(name));

    return fetch(apiUrl + '/projects', {
        method: 'POST',
        body: JSON.stringify(project),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (response.status !== 200) {
                throw response.statusText;
            }
            return FromApi(project);
        });
}

export function updateProject(project: Project): Promise<Project> {
    return fetch(apiUrl + '/projects/' + project.name, {
        method: 'PUT',
        body: JSON.stringify(ToApi(project)),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (response.status !== 200) {
                throw response.statusText;
            }
            return project;
        });
}

export function copyProject(project: Project): Promise<Project> {
    throw 'Not implemented';
}

export function deleteProject(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        return fetch(apiUrl + '/projects/' + name, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.status !== 200) {
                throw response.statusText;
            }
            return name;
        });
    });
}

export function previewProject(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        resolve(apiUrl + '/preview?' + Math.random());
    });
}
