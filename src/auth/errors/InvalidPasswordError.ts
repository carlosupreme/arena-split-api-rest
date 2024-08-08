export class InvalidPasswordError extends Error {
    constructor(password: string) {
        super(`Password <${password}> must have at least 8 characters`);
    }
}