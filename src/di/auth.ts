import {ContainerBuilder, Reference} from "node-dependency-injection";
import {HashService} from "../auth/services/HashService";
import {InMemoryAuthRepository} from "../auth/repositories/InMemoryAuthRepository";
import {RegisterUserCommandHandler} from "../auth/commands/RegisterUserCommandHandler";
import {RegisterUserController} from "../auth/controllers/RegisterUserController";
import {LoginUserController} from "../auth/controllers/LoginUserController";
import {JWTGenerator} from "../auth/services/JWTGenerator";
import {LoginUserQueryHandler} from "../auth/queries/LoginUserQueryHandler";

export default function registerAuthDependencies(container: ContainerBuilder) {
    container.register('HashService', HashService)
    container.register("TokenGenerator", JWTGenerator)
        .addArgument("secret-token")

    container.register('AuthRepository', InMemoryAuthRepository)
        .addArgument(new Reference('HashService'))

    container.register("LoginUserQueryHandler", LoginUserQueryHandler)
        .addArgument(new Reference('AuthRepository'))
        .addArgument(new Reference('UserRepository'))
        .addArgument(new Reference('TokenGenerator'))
        .addTag('queryHandler')

    container.register("RegisterUserCommandHandler", RegisterUserCommandHandler)
        .addArgument(new Reference('AuthRepository'))
        .addArgument(new Reference('CommandBus'))
        .addTag('commandHandler')

    container.register('RegisterUserController', RegisterUserController)
        .addArgument(new Reference('CommandBus'))

    container.register('LoginUserController', LoginUserController)
        .addArgument(new Reference('QueryBus'))

    return container;
}