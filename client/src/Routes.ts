export function navigateTo(url: string) {
    window.location.href = url;
}

class Route {
    constructor(public reactRouterPath: string) { }
}

class StaticRoute extends Route {
    constructor(reactRouterPath: string, private _url: string) {
        super(reactRouterPath);
    }
    url(): string {
        return this._url;
    }
}
export var Home = new StaticRoute('/home', '#/home');
export var ProjectList = new StaticRoute('/projects/', '#/projects/');

class ProjectRoute extends Route {
    constructor() {
        super('/project/:name');
    }
    url(projectName: string): string {
        return '#/project/' + projectName;
    }
}

export var Project = new ProjectRoute();