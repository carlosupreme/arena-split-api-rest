import {describe, expect, it} from "vitest";
import {InMemoryAuthRepository} from "../../../src/auth/repositories/InMemoryAuthRepository";
import {HashService} from "../../../src/auth/services/HashService";

describe("InMemoryAuthRepository", async () => {
    it('should create a password given an email', async () => {
        const email = "test@test.com";
        const password = "password";
        const authRepository = new InMemoryAuthRepository(new HashService());
        await authRepository.assignPassword(email, password);
        const passwordIsCorrect = await authRepository.checkPassword(email, password);

        expect(passwordIsCorrect).toBe(true);
    })

    it('should create a password given an email', async () => {
        const email = "test@test.com";
        const password = "password";
        const authRepository = new InMemoryAuthRepository(new HashService());
        await authRepository.assignPassword(email, password);

        expect(await authRepository.checkPassword(email, "wrongPassword")).toBe(false);
    })
})