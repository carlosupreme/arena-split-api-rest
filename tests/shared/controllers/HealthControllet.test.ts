import {describe, expect, it} from "vitest";
import request from 'supertest';
import httpStatus from "http-status";
import {Application} from "../../../src/app";

describe("Health controller", () => {

    it('should return OK', async () => {
        const app = await Application.initialize();
        const route = '/api/health';
        const status = httpStatus.OK;
        const expectedResponse = {status: 'Server running'};

        const response = await request(app.server).get(route)

        expect(response.status).toEqual(status);
        expect(response.body).toEqual(expectedResponse);
    });
})