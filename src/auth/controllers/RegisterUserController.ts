import {Controller} from "../../shared/controllers/Controller";
import {CommandBus} from "arena-split-core";
import {Request, Response} from "express";
import httpStatus from "http-status";
import {ProblemDetails} from "problem-details-http";
import {RegisterUserCommand} from "../commands/RegisterUserCommand";

type RegisterUserRequest = {
    id: string;
    fullName: string;
    username: string;
    email: string;
    password: string;
};

export class RegisterUserController extends Controller {
    constructor(private readonly commandBus: CommandBus) {
        super();
    }

    async run(req: Request<RegisterUserRequest>, res: Response) {
        const error = await this.createUser(req);
        if (error) {
            res.status(error.status).json(error.toJson());
        } else {
            res.status(httpStatus.CREATED).json({});
        }
    }

    private async createUser({body}: Request<RegisterUserRequest>): Promise<ProblemDetails | void> {
        try {
            const registerUserCommand = new RegisterUserCommand(
                body.id,
                body.fullName,
                body.email,
                body.username,
                body.password
            );

            await this.commandBus.dispatch(registerUserCommand)
        } catch (error) {
            return this.errorResponse(error);
        }
    }
}
