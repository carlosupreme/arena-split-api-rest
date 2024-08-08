import {Express} from 'express';
import {ContainerBuilder} from "node-dependency-injection";
import {RegisterUserController} from "../auth/controllers/RegisterUserController";
import {LoginUserController} from "../auth/controllers/LoginUserController";

export const register = async (app: Express, container: ContainerBuilder) => {
    const registerController = container.get<RegisterUserController>('RegisterUserController');
    const loginController = container.get<LoginUserController>('LoginUserController');

    app.post('/auth/register', registerController.run.bind(registerController));
    app.post('/auth/login', loginController.run.bind(loginController));
};
