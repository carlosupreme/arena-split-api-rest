import {Command} from "arena-split-core";

export class RegisterUserCommand extends Command {
    constructor(
        readonly id: string,
        readonly fullName: string,
        readonly email: string,
        readonly username: string,
        readonly password: string
    ) {
        super();
    }
}