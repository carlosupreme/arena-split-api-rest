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
import PDBuilder from "problem-details-http";
import {InMemoryUserRepository} from "../../../src/friends/repository/InMemoryUserRepository";
import {InMemoryAuthRepository} from "../../../src/auth/repositories/InMemoryAuthRepository";
import {UserMother} from "../../friends/UserMother";

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

    it('should not create a user because id validation error', async () => {
        const user = UserMother.withInvalidId();
        const expectedResponse = PDBuilder.fromError(new InvalidUUIDError(user.id)).build();

        const actualResponse = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(actualResponse.status).toEqual(expectedResponse.status);
        expect(actualResponse.body).toEqual(expectedResponse.toJson());
    })

    it('should not create a user because full name validation error', async () => {
        const user = UserMother.withInvalidFullName();
        const expectedResponse = PDBuilder.fromError(new InvalidFullNameError(user.fullName)).build();

        const actualResponse = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(actualResponse.status).toEqual(expectedResponse.status);
        expect(actualResponse.body).toEqual(expectedResponse.toJson());
    })

    it('should not create a user because username validation error', async () => {
        const user = UserMother.withInvalidUsername();
        const expectedResponse = PDBuilder.fromError(new InvalidUserNameError(user.username)).build();

        const actualResponse = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(actualResponse.status).toEqual(expectedResponse.status);
        expect(actualResponse.body.detail).toContain(user.username);
    })

    it('should not create a user because email validation error', async () => {
        const user = UserMother.withInvalidEmail();
        const expectedResponse = PDBuilder.fromError(new InvalidEmailAddressError(user.email)).build();

        const actualResponse = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(actualResponse.status).toEqual(expectedResponse.status);
        expect(actualResponse.body).toEqual(expectedResponse.toJson());
    })
})
