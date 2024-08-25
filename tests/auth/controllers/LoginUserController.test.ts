import {beforeAll, describe, expect, it} from "vitest";
import {Application} from "../../../src/app";
import httpStatus from "http-status";
import request from "supertest";
import {UserMother} from "../../friends/UserMother";
import {InvalidCredentialsError} from "../../../src/auth/errors/InvalidCredentialsError";
import {ErrorMapper} from "../../../src/shared/infrastructure/ErrorMapper";

describe("Login User Controller", async () => {
    const app = await Application.initialize();
    const loginRoute = '/api/auth/login';
    const registerRoute = '/api/auth/register';
    const user = UserMother.normal();

    beforeAll(async () => {
        await request(app.server)
            .post(registerRoute)
            .set('Accept', 'application/json')
            .send(user);
    })

    it('should log in an user successfully', async () => {
        const expectedStatus = httpStatus.OK;
        const expectedResponse = {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                username: user.username
            },
            token: expect.any(String)
        };

        const actualResponse = await request(app.server)
            .post(loginRoute)
            .set('Accept', 'application/json')
            .send({email: user.email, password: user.password});

        expect(actualResponse.status).toEqual(expectedStatus);
        expect(actualResponse.body).toEqual(expectedResponse);
    })

    it('should validate an invalid password', async () => {
        const invalidPassword = 'invalid-password';
        const expectedStatus = httpStatus.UNAUTHORIZED;
        const error = new InvalidCredentialsError();
        const expectedResponse = ErrorMapper.mapDomainErrorToProblemDetails(error).toJson();

        const actualResponse = await request(app.server)
            .post(loginRoute)
            .set('Accept', 'application/json')
            .send({email: user.email, password: invalidPassword});

        expect(actualResponse.status).toEqual(expectedStatus);
        expect(actualResponse.body).toEqual(expectedResponse);

    })

    it('should validate an invalid email', async () => {
        const invalidEmail = 'invalid-email';
        const expectedStatus = httpStatus.UNAUTHORIZED;
        const error = new InvalidCredentialsError();
        const expectedResponse = ErrorMapper.mapDomainErrorToProblemDetails(error).toJson();

        const actualResponse = await request(app.server)
            .post(loginRoute)
            .set('Accept', 'application/json')
            .send({email: invalidEmail, password: user.password});

        expect(actualResponse.status).toEqual(expectedStatus);
        expect(actualResponse.body).toEqual(expectedResponse);
    })
})
