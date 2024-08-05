import {Express} from 'express';
import {CreateUserController} from "../friends/controllers/CreateUserController";
import {ContainerBuilder} from "node-dependency-injection";

export const register = async (app: Express, container: ContainerBuilder) => {
    const friendsController: CreateUserController = container.get('CreateUserController');

    app.post('/user', friendsController.run.bind(friendsController));
};
