import {Express} from 'express';
import {HealthController} from "../shared/controllers/HealthController";
import {ContainerBuilder} from "node-dependency-injection";

export const register = async (app: Express, container: ContainerBuilder) => {
    const healthController: HealthController = container.get('HealthController');
    app.get('/health', healthController.run.bind(healthController));
};