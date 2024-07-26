import {Router} from 'express';
import {globSync} from 'fast-glob';
import path from "node:path";

export function registerRouteFiles(router: Router) {
    const routes = globSync(path.resolve(__dirname, '*.route.*'));
    routes.forEach(route => register(route, router));
}

function register(routePath: string, app: Router) {
    import(routePath).then(route => {
        route.register(app)
    });
}
