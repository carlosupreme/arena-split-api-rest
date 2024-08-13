import {Request, Response} from 'express';
import {DomainError} from "arena-split-core";
import PDBuilder, {ProblemDetails} from "problem-details-http";

export abstract class Controller {
    abstract run(req: Request, res: Response): Promise<void>;

    errorResponse(error: unknown): ProblemDetails {

        if (error instanceof DomainError) {
            return PDBuilder.fromStatus(400)
                .title(error.title)
                .detail(error.detail)
                .extensions({solutions: error.solutions})
                .build();
        }

        return ProblemDetails.default(500);
    }
}
