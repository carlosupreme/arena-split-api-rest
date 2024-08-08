import {Query, QueryHandler, User, UserRepository} from "arena-split-core";
import {LoginUserQuery} from "./LoginUserQuery";
import {LoginUserResponse} from "./LoginUserResponse";
import {AuthRepository} from "../interfaces/AuthRepository";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {TokenGenerator} from "../interfaces/TokenGenerator";

export class LoginUserQueryHandler implements QueryHandler<LoginUserQuery, LoginUserResponse> {

    constructor(private readonly authRepository: AuthRepository,
                private readonly userRepository: UserRepository,
                private readonly tokenGenerator: TokenGenerator
    ) {
    }

    async handle(query: LoginUserQuery): Promise<LoginUserResponse> {
        const user = await this.getUserByEmail(query.email);

        await this.ensureValidCredentials(query.email, query.password);

        const token = await this.tokenGenerator.generate(user.toPrimitives());

        return new LoginUserResponse(token);
    }

    private async getUserByEmail(email:string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        return user;
    }

    private async ensureValidCredentials(email: string, password: string) {
        const credentialsAreCorrect = await this.authRepository.checkPassword(email, password);

        if (!credentialsAreCorrect) {
            throw new InvalidCredentialsError();
        }
    }

    subscribedTo(): Query {
        return LoginUserQuery;
    }
}