import {Controller} from "../../shared/Controller";
import {
    CommandBus,
    InvalidEmailAddressError,
    InvalidFullNameError,
    InvalidUserNameError,
    InvalidUUIDError
} from "arena-split-core";
import {Request, Response} from "express";
import httpStatus from "http-status";
import PDBuilder, {ProblemDetails} from "problem-details-http";
import {RegisterUserCommand} from "../commands/RegisterUserCommand";
import {InvalidPasswordError} from "../errors/InvalidPasswordError";

type RegisterUserRequest = {
    id: string;
    fullName: string;
    username: string;
    email: string;
    password: string;
};

export class RegisterUserController implements Controller {
    constructor(private readonly commandBus: CommandBus) {
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

            console.log(error)

            if (error instanceof InvalidUUIDError ||
                error instanceof InvalidFullNameError ||
                error instanceof InvalidEmailAddressError ||
                error instanceof InvalidUserNameError ||
                error instanceof InvalidPasswordError
            ) {
                return PDBuilder.fromError(error).build();
            }

            return PDBuilder.fromDetail("Error creating user").build();
        }
    }
}
