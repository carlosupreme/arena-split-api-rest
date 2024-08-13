import {DomainError} from "arena-split-core";

export class InvalidCredentialsError extends DomainError {
    constructor() {
        const title = `Invalid credentials`
        const detail = `Invalid credentials provided`
        const solutions = [`Check the email and password provided`]
        super({title, detail, solutions});
    }
}