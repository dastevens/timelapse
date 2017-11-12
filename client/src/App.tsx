import * as React from 'react';
import {
    HashRouter,
    Route,
    Switch,
} from 'react-router-dom';
import { Project } from './model/Project';
import { getProjectList } from './api/Projects';
import './App.css';
import * as Routes from './Routes';
import { Navigation } from './Navigation';
import { Home as HomePage } from './pages/Home';
import { ProjectList as ProjectListPage } from './pages/ProjectList';
import { Project as ProjectPage } from './pages/Project';
import { NotFound as NotFoundPage } from './pages/NotFound';

enum LoadingState {
    Init,
    Loading,
    Ready,
    Error
}

class AppState {
    loadingState: LoadingState;
    error: string;
    projects: Project[];
}

class App extends React.Component<{}, AppState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            loadingState: LoadingState.Init,
            error: '',
            projects: []
        };
    }

    componentDidMount() {
        this.load();
    }

    load() {
        this.setState({
            loadingState: LoadingState.Loading,
            error: '',
            projects: []
        });

        return getProjectList()
            .then(
            projects => {
                this.setState({
                    loadingState: LoadingState.Ready,
                    error: '',
                    projects: projects.sort((a, b) => {
                        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                    })
                });
            },
            error => {
                this.setState({
                    loadingState: LoadingState.Error,
                    error: error,
                    projects: []
                });
            }
            );
    }

    projectListPageRender(props: {}) {
        return (
            <ProjectListPage projects={this.state.projects}/>
        );
    }

    projectPageRender(props: {}) {
        if (this.state.loadingState !== LoadingState.Ready) {
            return <p>Loading</p>
        } else {
            let name = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
            let project = this.state.projects.find(p => p.name === name);
            if (project === undefined) {
                return <NotFoundPage />
            } else {
                return <ProjectPage project={project} refreshProjectList={() => this.load()} />
            }
        }
    }

    render() {
        return (
          <div className="App">
            <Navigation projects={this.state.projects} />
            <HashRouter>
                <Switch>
                    <Route path={Routes.Home.reactRouterPath} component={HomePage} />
                    <Route path={Routes.ProjectList.reactRouterPath} render={() => this.projectListPageRender({})} />
                    <Route path={Routes.Project.reactRouterPath} render={() => this.projectPageRender({})} />
                    <Route path="/.+" component={NotFoundPage} />
                </Switch>
            </HashRouter>
        </div>
    );
  }
}

export default App;
