import {describe, expect, it} from "vitest";
import {Application} from "../../../src/app";
import httpStatus from "http-status";
import request from "supertest";
import {InvalidFullNameError, UserId} from "arena-split-core";
import PDBuilder from "problem-details-http";

describe("CreateUserController", async () => {
    const app = await Application.create();
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

    it('should not create a user because full name validation error', async () => {
        const user = {
            id: UserId.create().value,
            fullName: "",
            email: "test@test.com",
            username: "username",
        }

        const expectedResponse = PDBuilder.fromError(new InvalidFullNameError(user.fullName)).build();

        const response = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(response.status).toEqual(expectedResponse.status);
    })
})