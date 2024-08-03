import {describe, expect, it} from "vitest";
import {Application} from "../../../src/app";
import httpStatus from "http-status";
import request from "supertest";
import {
    InvalidEmailAddressError,
    InvalidFullNameError,
    InvalidUserNameError,
    InvalidUUIDError,
    UserId
} from "arena-split-core";
import PDBuilder from "problem-details-http";

describe("CreateUserController", async () => {
    const app = await Application.initialize();
    const route = '/api/user';

    it('should create a user successfully', async () => {
        const user = {
            id: UserId.create().value,
            fullName: "John Doe",
            email: "test@test.com",
            username: "username",
        }

        const status = httpStatus.CREATED;
        const expectedResponse = {};

        const response = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(response.status).toEqual(status);
        expect(response.body).toEqual(expectedResponse);
    })

    it('should not create a user because id validation error', async () => {
        const user = {
            id: "invalid-id",
            fullName: "Full name",
            email: "test@test.com",
            username: "carlosupreme",
        }

        const expectedResponse = PDBuilder.fromError(new InvalidUUIDError(user.id)).build();

        const response = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(response.status).toEqual(expectedResponse.status);
        expect(response.body.detail).toContain(user.id);

        console.log(response.body)
    })


    it('should not create a user because full name validation error', async () => {
        const user = {
            id: UserId.create().value,
            fullName: "a",
            email: "test@test.com",
            username: "username",
        }

        const expectedResponse = PDBuilder.fromError(new InvalidFullNameError(user.fullName)).build();

        const response = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(response.status).toEqual(expectedResponse.status);
        expect(response.body.detail).toContain(expectedResponse.detail);
    })

    it('should not create a user because username validation error', async () => {
        const user = {
            id: UserId.create().value,
            fullName: "Full name",
            email: "test@test.com",
            username: "",
        }

        const expectedResponse = PDBuilder.fromError(new InvalidUserNameError(user.username)).build();

        const response = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(response.status).toEqual(expectedResponse.status);
        expect(response.body.title).toEqual("Invalid User Name Error");
    })

    it('should not create a user because email validation error', async () => {
        const user = {
            id: UserId.create().value,
            fullName: "Full name",
            email: "test",
            username: "username",
        }

        const expectedResponse = PDBuilder.fromError(new InvalidEmailAddressError(user.email)).build();

        const response = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(response.status).toEqual(expectedResponse.status);
        expect(response.body).toEqual(expectedResponse);
    })
})
