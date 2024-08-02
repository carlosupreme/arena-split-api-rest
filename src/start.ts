import {Application} from './app';

Application.initialize()
    .then((app) => app.start())
    .catch((e) => console.log(e));