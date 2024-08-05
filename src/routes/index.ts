import {Router} from 'express';
import {globSync} from 'fast-glob';
import path from "node:path";
import {ContainerBuilder} from "node-dependency-injection";

export function registerRouteFiles(router: Router, container: ContainerBuilder) {
    const routes = globSync(path.resolve(__dirname, '*.route.*'));
    routes.forEach(route => register(route, router, container));
}

function register(routePath: string, app: Router, container: ContainerBuilder) {
    import(routePath).then(route => {
        route.register(app, container)
    });
}
