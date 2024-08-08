import {describe, expect, it} from "vitest";
import {HashService} from "../../../src/auth/services/HashService";

describe("HashService", async () => {
    it('should hash a password', async () => {
        const hashService = new HashService();
        const plainPassword = "password";
        const hashedPassword = await hashService.hash(plainPassword);

        expect(hashedPassword).not.toEqual(plainPassword);
    })
});