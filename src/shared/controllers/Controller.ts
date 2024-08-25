import {Request, Response} from 'express';
import {DomainError} from "arena-split-core";
import {ProblemDetails} from "problem-details-http";
import {ErrorMapper} from "../infrastructure/ErrorMapper";

export abstract class Controller {
    abstract run(req: Request, res: Response): Promise<void>;

    errorResponse(error: unknown): ProblemDetails {
        if (error instanceof DomainError) {
            return ErrorMapper.mapDomainErrorToProblemDetails(error);
        }

        if (error instanceof Error) {
            return ErrorMapper.mapErrorToProblemDetails(error);
        }

        return ProblemDetails.default(500);
    }
}
