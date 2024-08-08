import {Controller} from "../../shared/Controller";
import {QueryBus} from "arena-split-core";
import {Request, Response} from "express";
import httpStatus from "http-status";
import PDBuilder, {ProblemDetails} from "problem-details-http";
import {LoginUserQuery} from "../queries/LoginUserQuery";
import {LoginUserResponse} from "../queries/LoginUserResponse";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";

type LoginUserRequest = {
    email: string;
    password: string;
};

export class LoginUserController implements Controller {
    constructor(private readonly queryBus: QueryBus) {
    }

    async run(req: Request<LoginUserRequest>, res: Response) {
        const response = await this.loginUser(req);
        if (response instanceof ProblemDetails) {
            res.status(response.status).json(response.toJson());
        } else {
            res.status(httpStatus.OK).json({token: response.token});
        }
    }

    private async loginUser({body}: Request<LoginUserRequest>): Promise<ProblemDetails | LoginUserResponse> {
        try {
            const loginUserQuery = new LoginUserQuery(
                body.email,
                body.password
            );

            return await this.queryBus.ask<LoginUserResponse>(loginUserQuery);
        } catch (error) {
            if (error instanceof InvalidCredentialsError) {
                return PDBuilder.fromError(error).build();
            }

            return PDBuilder.fromDetail("Error while login user").build();
        }
    }
}
