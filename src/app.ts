import container from './di';
import httpServer from './server';
import {Command, CommandHandler, DomainEvent, DomainEventSubscriber, EventBus} from "arena-split-core";
import CommandHandlers from "./shared/commads/CommandHandlers";
import {Express} from "express";

export class Application {
    readonly server: Express;

    static async initialize(): Promise<Application> {
        const app = new Application();
        await app.arrange();
        return app;
    }

    constructor() {
        this.server = httpServer
    }

    async arrange(): Promise<void> {
        await this.configureEventBus();
        await this.configureCommandBus();
    }

    async start(port?: string): Promise<void> {
        port = port || process.env.PORT || '3000';
        this.server.listen(port, () => {
            console.log(
                `\tArena split Backend is running at http://localhost:${port} in ${this.server.get('env')} mode`
            );
            console.log('\tPress CTRL-C to stop\n');
        });
    }

    private async configureEventBus() {
        const eventBus = container.get<EventBus>('EventBus');

        const subscriberDefinitions = container.findTaggedServiceIds('domainEventSubscriber');

        for (const {id} of subscriberDefinitions) {
            const domainEventSubscriber = container.get<DomainEventSubscriber<DomainEvent>>(id);
            eventBus.addSubscribers(domainEventSubscriber);
        }
    }

    private async configureCommandBus() {
        const commandHandlers = container.get<CommandHandlers>('CommandHandlers');

        const commandHandlerDefinitions = container.findTaggedServiceIds('commandHandler');

        for (const {id} of commandHandlerDefinitions) {
            const commandHandler = container.get<CommandHandler<Command>>(id);
            commandHandlers.put(commandHandler);
        }
    }
}