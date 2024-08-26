import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {Application} from "../../../src/app";
import httpStatus from "http-status";
import request from "supertest";
import {UserMother} from "../../friends/UserMother";
import {InvalidCredentialsError} from "../../../src/auth/errors/InvalidCredentialsError";
import {ErrorMapper} from "../../../src/shared/infrastructure/ErrorMapper";
import {InMemoryUserRepository} from "../../../src/friends/repository/InMemoryUserRepository";
import {InMemoryAuthRepository} from "../../../src/auth/repositories/InMemoryAuthRepository";

describe("Login User Controller", async () => {
    let app: Application;
    let userRepository: InMemoryUserRepository;
    let authRepository: InMemoryAuthRepository;
    const registerRoute = '/api/auth/register';
    const loginRoute = '/api/auth/login';

    beforeEach(async () => {
        app = await Application.initialize();
        userRepository = app.container.get<InMemoryUserRepository>("UserRepository");
        authRepository = app.container.get<InMemoryAuthRepository>("AuthRepository");

        const user = UserMother.normal();

        await request(app.server)
            .post(registerRoute)
            .set('Accept', 'application/json')
            .send(user);

        expect(userRepository.count()).toBe(1);
        expect(await authRepository.checkPassword(user.email, user.password)).toBe(true);
    });

    afterEach(async () => {
        app = await Application.initialize();
        userRepository = app.container.get<InMemoryUserRepository>("UserRepository");
        authRepository = app.container.get<InMemoryAuthRepository>("AuthRepository");
    });

    it('should log in an user successfully', async () => {
        const user = UserMother.normal();
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
        const user = UserMother.normal();
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
        const user = UserMother.normal();
        const invalidEmail = 'invalidEmail@email.com';
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
