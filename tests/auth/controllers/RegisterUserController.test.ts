import {describe, expect, it} from "vitest";
import {Application} from "../../../src/app";
import httpStatus from "http-status";
import request from "supertest";
import {
    InvalidEmailAddressError,
    InvalidFullNameError,
    InvalidUserNameError,
    InvalidUUIDError,
} from "arena-split-core";
import {InMemoryUserRepository} from "../../../src/friends/repository/InMemoryUserRepository";
import {InMemoryAuthRepository} from "../../../src/auth/repositories/InMemoryAuthRepository";
import {UserMother} from "../../friends/UserMother";
import {ErrorMapper} from "../../../src/shared/infrastructure/ErrorMapper";
import {RequiredValuesError} from "../../../src/shared/errors/RequiredValuesError";

describe("CreateUserController", async () => {
    const app = await Application.initialize();
    const userRepository = app.container.get<InMemoryUserRepository>("UserRepository");
    const authRepository = app.container.get<InMemoryAuthRepository>("AuthRepository");
    const route = '/api/auth/register';

    it('should create a user successfully', async () => {
        const user = UserMother.normal();
        const expectedStatus = httpStatus.CREATED;
        const expectedResponse = {};

        const actualResponse = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(actualResponse.status).toEqual(expectedStatus);
        expect(actualResponse.body).toEqual(expectedResponse);
        expect(user).to.contain(userRepository.users[0].toPrimitives());
        expect(await authRepository.checkPassword(user.email, user.password)).toBe(true);
    })

    it('should not create an user because of missing values', async () => {
        const user = UserMother.missingFullName();
        const expectedStatus = httpStatus.BAD_REQUEST;
        const error = new RequiredValuesError(['fullName']);
        const expectedResponse = ErrorMapper.mapErrorToProblemDetails(error).toJson();

        const actualResponse = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        console.log(actualResponse.body);

        expect(actualResponse.status).toEqual(expectedStatus);
        expect(actualResponse.body).toEqual(expectedResponse);
    })

    it('should not create a user because id validation error', async () => {
        const user = UserMother.withInvalidId();
        const error = new InvalidUUIDError(user.id);
        const expectedResponse = ErrorMapper.mapDomainErrorToProblemDetails(error);

        const actualResponse = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(actualResponse.status).toEqual(expectedResponse.status);
        expect(actualResponse.body).toEqual(expectedResponse.toJson());
    })

    it('should not create a user because full name validation error', async () => {
        const user = UserMother.withInvalidFullName();
        const error = new InvalidFullNameError(user.fullName);
        const expectedResponse = ErrorMapper.mapDomainErrorToProblemDetails(error);

        const actualResponse = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(actualResponse.status).toEqual(expectedResponse.status);
        expect(actualResponse.body).toEqual(expectedResponse.toJson());
    })

    it('should not create a user because username validation error', async () => {
        const user = UserMother.withInvalidUsername();
        const error = new InvalidUserNameError(user.username);
        const expectedResponse = ErrorMapper.mapDomainErrorToProblemDetails(error);

        const actualResponse = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(actualResponse.status).toEqual(expectedResponse.status);
        expect(actualResponse.body.detail).toContain(user.username);
    })

    it('should not create a user because email validation error', async () => {
        const user = UserMother.withInvalidEmail();
        const error = new InvalidEmailAddressError(user.email);
        const expectedResponse = ErrorMapper.mapDomainErrorToProblemDetails(error);

        const actualResponse = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(actualResponse.status).toEqual(expectedResponse.status);
        expect(actualResponse.body).toEqual(expectedResponse.toJson());
    })
})
