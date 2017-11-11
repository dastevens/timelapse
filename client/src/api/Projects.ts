import { Project } from '../model/Project';

export function getProjectList(): Promise<Project[]> {

    return new Promise<Project[]>((resolve, reject) => {

        // Fake a list
        setTimeout(
            function () {
                resolve(
                    new Array(10).fill(0).map((z, i) => new Project('Project ' + i))
                );
            },
            1000);

    });
}