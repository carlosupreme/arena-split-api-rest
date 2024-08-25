import {Controller} from "../../shared/controllers/Controller";
import {QueryBus} from "arena-split-core";
import {Request, Response} from "express";
import httpStatus from "http-status";
import {ProblemDetails} from "problem-details-http";
import {LoginUserQuery} from "../queries/LoginUserQuery";
import {LoginUserResponse} from "../queries/LoginUserResponse";

type LoginUserRequest = {
    email: string;
    password: string;
};

export class LoginUserController extends Controller {
    constructor(private readonly queryBus: QueryBus) {
        super();
    }

    async run(req: Request<LoginUserRequest>, res: Response) {
        const response = await this.loginUser(req);
        if (response instanceof ProblemDetails) {
            res.status(response.status).json(response.toJson());
        } else {
            res.status(httpStatus.OK).json(response);
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
            return this.errorResponse(error);
        }
    }
}
