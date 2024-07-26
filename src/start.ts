import {Application} from './app';

Application.create()
    .then((app) => app.start())
    .catch((e) => console.log(e));