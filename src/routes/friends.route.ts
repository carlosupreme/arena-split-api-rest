import {Express} from 'express';
import {CreateUserController} from "../friends/controllers/CreateUserController";
import container from "../di";

export const register = async (app: Express) => {
    const friendsController: CreateUserController = container.get('CreateUserController');

    app.post('/user', friendsController.run.bind(friendsController));
};
