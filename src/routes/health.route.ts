import {Express} from 'express';
import container from "../di";
import {HealthController} from "../shared/controllers/HealthController";

export const register = async (app: Express) => {
    const healthController: HealthController = container.get('HealthController');
    console.log('healthController', healthController);
    app.get('/health', healthController.run.bind(healthController));
};
