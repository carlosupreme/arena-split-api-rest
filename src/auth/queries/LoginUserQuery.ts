import {Query} from "arena-split-core";

export class LoginUserQuery extends Query {
    constructor(
        public readonly email: string,
        public readonly password: string
    ) {
        super();
    }
}