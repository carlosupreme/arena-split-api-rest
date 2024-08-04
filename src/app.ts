import externalContainer from './di';
import httpServer from './server';
import {Command, CommandHandler, DomainEvent, DomainEventSubscriber, EventBus} from "arena-split-core";
import CommandHandlers from "./shared/commads/CommandHandlers";
import {Express} from "express";
import {ContainerBuilder} from "node-dependency-injection";

export class Application {
    readonly server: Express;
    readonly container: ContainerBuilder;

    static async initialize(): Promise<Application> {
        const app = new Application(httpServer, externalContainer);
        await app.arrange();
        return app;
    }

    constructor(server: Express, container: ContainerBuilder) {
        this.server = server;
        this.container = container;
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
        const eventBus = this.container.get<EventBus>('EventBus');

        const subscriberDefinitions = this.container.findTaggedServiceIds('domainEventSubscriber');

        for (const {id} of subscriberDefinitions) {
            const domainEventSubscriber = this.container.get<DomainEventSubscriber<DomainEvent>>(id);
            eventBus.addSubscribers(domainEventSubscriber);
        }
    }

    private async configureCommandBus() {
        const commandHandlers = this.container.get<CommandHandlers>('CommandHandlers');

        const commandHandlerDefinitions = this.container.findTaggedServiceIds('commandHandler');

        for (const {id} of commandHandlerDefinitions) {
            const commandHandler = this.container.get<CommandHandler<Command>>(id);
            commandHandlers.put(commandHandler);
        }
    }
}