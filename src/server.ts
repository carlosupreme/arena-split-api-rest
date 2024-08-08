import express, {Express, NextFunction, Request, Response} from "express";
import Router from "express-promise-router";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import errorHandler from "errorhandler";
import {registerRouteFiles} from "./routes";
import httpStatus from "http-status";
import {ContainerBuilder} from "node-dependency-injection";

export default function getServer(container: ContainerBuilder): Express {
    const server = express();
    configureHeaders(server)
    registerRoutes(server)

    function configureHeaders(server: Express) {
        server.use(express.json());
        server.use(express.urlencoded({extended: true}));
        server.use(helmet.xssFilter());
        server.use(helmet.noSniff());
        server.use(helmet.hidePoweredBy());
        server.use(helmet.frameguard({action: 'deny'}));
        server.use(compression());
    }

    function registerRoutes(server: Express) {
        const router = Router();
        router.use(cors());
        router.use(errorHandler());
        registerRouteFiles(router, container);
        server.use("/api", router);
        router.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
            console.error(err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
        });
    }

    return server;
};