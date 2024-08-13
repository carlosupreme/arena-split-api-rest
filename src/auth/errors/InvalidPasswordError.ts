import {DomainError} from "arena-split-core";

export class InvalidPasswordError extends DomainError {
    constructor(password: string) {
        const title = `Invalid password`
        const detail = `The password <${password}> is invalid`
        const solutions = [
            "The password must have at least 8 characters",
            "The password must have at least one uppercase letter",
        ]
        super({title, detail, solutions});
    }
}