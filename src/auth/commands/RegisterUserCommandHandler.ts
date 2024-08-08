import {RegisterUserCommand} from "./RegisterUserCommand";
import {Command, CommandBus, CommandHandler, CreateUserCommand} from "arena-split-core";
import {AuthRepository} from "../interfaces/AuthRepository";
import {InvalidPasswordError} from "../errors/InvalidPasswordError";

export class RegisterUserCommandHandler implements CommandHandler<RegisterUserCommand> {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly commandBus: CommandBus
    ) {
    }

    async handle(command: RegisterUserCommand): Promise<void> {
        this.validatePassword(command.password);

        const createUserCommand = new CreateUserCommand({
            id: command.id,
            fullName: command.fullName,
            email: command.email,
            username: command.username
        });

        await Promise.all([
            this.commandBus.dispatch(createUserCommand),
            this.authRepository.assignPassword(command.email, command.password)
        ])
    }

    private validatePassword(password: string) {
        if (!password || password.length < 8) {
            throw new InvalidPasswordError(password);
        }
    }

    subscribedTo(): Command {
        return RegisterUserCommand;
    }
}