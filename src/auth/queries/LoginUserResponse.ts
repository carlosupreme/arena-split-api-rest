import {UserPrimitive} from "arena-split-core";

export class LoginUserResponse {
    constructor(
        public readonly token: string,
        public readonly user: UserPrimitive
    ) {
    }
}