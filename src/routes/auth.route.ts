import {Express} from 'express';
import {ContainerBuilder} from "node-dependency-injection";
import {RegisterUserController} from "../auth/controllers/RegisterUserController";

export const register = async (app: Express, container: ContainerBuilder) => {
    const registerController = container.get<RegisterUserController>('RegisterUserController');

    app.post('/auth/register', registerController.run.bind(registerController));
};
