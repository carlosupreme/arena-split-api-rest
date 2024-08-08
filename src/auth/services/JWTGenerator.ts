import {TokenGenerator} from "../interfaces/TokenGenerator";
import {sign, verify} from "jsonwebtoken";
import {UserPrimitive} from "arena-split-core";

export class JWTGenerator implements TokenGenerator {
    constructor(private readonly secret: string) {
    }

    async generate(payload: UserPrimitive): Promise<string> {
        return sign(payload, this.secret);
    }

    async validate(token: string): Promise<UserPrimitive> {
        return verify(token, this.secret) as UserPrimitive;
    }
}