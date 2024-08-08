import {beforeAll, describe, expect, it} from "vitest";
import {Application} from "../../../src/app";
import httpStatus from "http-status";
import request from "supertest";
import {UserMother} from "../../friends/UserMother";

describe("Login User Controller", async () => {
    const app = await Application.initialize();
    const route = '/api/auth/login';
    const user = UserMother.normal();

    beforeAll(async () => {
        await request(app.server)
            .post('/api/auth/register')
            .set('Accept', 'application/json')
            .send(user);
    })

    it('should log in an user successfully', async () => {
        const expectedStatus = httpStatus.OK;
        const expectedResponse = {
            token: expect.any(String)
        };

        const actualResponse = await request(app.server)
            .post(route)
            .set('Accept', 'application/json')
            .send(user);

        expect(actualResponse.status).toEqual(expectedStatus);
        expect(actualResponse.body).toEqual(expectedResponse);
        expect(actualResponse.body.token).toEqual(expect.any(String));

    })
})
