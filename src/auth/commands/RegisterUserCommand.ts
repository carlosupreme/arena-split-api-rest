import {Command} from "arena-split-core";

export class RegisterUserCommand extends Command {
    constructor(
        public readonly id: string,
        public readonly fullName: string,
        public readonly email: string,
        public readonly username: string,
        public readonly password: string
    ) {
        super();
    }
}