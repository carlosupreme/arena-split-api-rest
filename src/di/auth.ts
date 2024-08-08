import {ContainerBuilder, Reference} from "node-dependency-injection";
import {HashService} from "../auth/services/HashService";
import {InMemoryAuthRepository} from "../auth/repositories/InMemoryAuthRepository";
import {RegisterUserCommandHandler} from "../auth/commands/RegisterUserCommandHandler";
import {RegisterUserController} from "../auth/controllers/RegisterUserController";

export default function registerAuthDependencies(container: ContainerBuilder) {
    container.register('HashService', HashService)
    container.register('AuthRepository', InMemoryAuthRepository)
        .addArgument(new Reference('HashService'))

    container.register("RegisterUserCommandHandler", RegisterUserCommandHandler)
        .addArgument(new Reference('AuthRepository'))
        .addArgument(new Reference('CommandBus'))
        .addTag('commandHandler')

    container.register('RegisterUserController', RegisterUserController)
        .addArgument(new Reference('CommandBus'))

    return container;
}