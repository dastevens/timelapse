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

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

class ApiProject implements Project {
    constructor(
        public readonly name: string,
        public readonly description: string = '',
        public readonly status: ProjectStatus = ProjectStatus.Setup,
        public readonly start: Date = tomorrow,
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
    return date.toISOString();
}

function StringToDate(str: string): Date {
    return new Date(str);
}

export function TimeSpanToSeconds(timeSpan: string): number {
    let parts = timeSpan.split(':');
    let hoursDays = parts[0].split('.');
    let days = hoursDays.length === 2 ? hoursDays[0] : '0';
    let hours = hoursDays.length === 2 ? hoursDays[1] : hoursDays[0];
    let minutes = parts[1];
    let seconds = parts[2];
    return parseFloat(seconds) + 60 * (parseInt(minutes, 10) + 60 * (parseInt(hours, 10) + 24 * parseInt(days, 10)));
}

export function SecondsToTimeSpan(value: number): string {
    let days = Math.floor(value / (24 * 60 * 60));
    let hours = Math.floor((value / (60 * 60)) - days * 24);
    let minutes = Math.floor((value / 60) - (days * 24  + hours) * 60);
    let seconds = Math.floor(value - (((days * 24 + hours) * 60) + minutes) * 60);
    let ms = value - Math.floor(value);
    return (days > 0 ? days + '.' : '')
        + zeroPad(hours)
        + ':'
        + zeroPad(minutes)
        + ':'
        + zeroPad(seconds)
        + (ms > 0 ? '.' + ms.toString().substr(2) : '');
}

function zeroPad(val: number): string {
    return ('00' + val).substr(-2);
}

export function getQueue(): Promise<Project[]> {

    return fetch(apiUrl + '/queue')
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

    return fetch(apiUrl + '/queue', {
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
    return fetch(apiUrl + '/queue/' + project.name, {
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
        return fetch(apiUrl + '/queue/' + name, {
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
