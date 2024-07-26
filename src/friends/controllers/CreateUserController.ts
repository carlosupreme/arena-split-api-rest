import {Request, Response} from "express";
import {CommandBus, CreateUserCommand, InvalidFullNameError} from "arena-split-core";
import {Controller} from "../../shared/Controller";
import httpStatus from "http-status";
import PDBuilder, {ProblemDetails} from "problem-details-http";

type CreateUserRequest = {
    id: string;
    fullName: string;
    username: string;
    email: string;
};

export class CreateUserController implements Controller {
    constructor(private readonly commandBus: CommandBus) {
    }

    async run(req: Request<CreateUserRequest>, res: Response) {
        const error = await this.createUser(req);
        if (error) {
            res.status(error.status).json(error);
        } else {
            res.status(httpStatus.CREATED).json({});
        }
    }

    private async createUser({body}: Request<CreateUserRequest>): Promise<ProblemDetails | void > {
        const createUserCommand = new CreateUserCommand({
            id: body.id,
            fullName: body.fullName,
            email: body.email,
            username: body.username,
        });

        try {
            await this.commandBus.dispatch(createUserCommand);
        } catch (error) {
            if (error instanceof InvalidFullNameError) {
                return PDBuilder.fromError(error).status(httpStatus.BAD_REQUEST).build();
            }
        }
    }
}