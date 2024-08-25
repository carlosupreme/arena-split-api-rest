import {DomainError} from "arena-split-core";
import PDBuilder, {ProblemDetails} from "problem-details-http";
import httpStatus from "http-status";
import {InvalidCredentialsError} from "../../auth/errors/InvalidCredentialsError";
import {RequiredValuesError} from "../errors/RequiredValuesError";

export class ErrorMapper {

    static mapDomainErrorToProblemDetails(error: DomainError): ProblemDetails {
        return PDBuilder.fromStatus(ErrorMapper.getHttpStatusCode(error))
            .title(error.title)
            .detail(error.detail)
            .extensions({solutions: error.solutions})
            .build();
    }

    static mapErrorToProblemDetails(error: Error): ProblemDetails {
        const builder = PDBuilder.fromStatus(ErrorMapper.getHttpStatusCode(error))
            .title(error.name)
            .detail(error.message);

        if (error instanceof RequiredValuesError) {
            builder.extensions({required: error.missingFields})
        }

        return builder.build();
    }

    static getHttpStatusCode(error: DomainError | Error): number {
        if (error instanceof InvalidCredentialsError) {
            return httpStatus.UNAUTHORIZED;
        }

        return httpStatus.BAD_REQUEST;
    }
}