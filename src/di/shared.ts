import {ContainerBuilder, Reference} from "node-dependency-injection";
import {InMemoryEventBus} from "../shared/events/InMemoryEventBus";
import CommandHandlers from "../shared/commads/CommandHandlers";
import {InMemoryCommandBus} from "../shared/commads/InMemoryCommandBus";
import {HealthController} from "../shared/controllers/HealthController";
import QueryHandlers from "../shared/queries/QueryHandlers";
import {InMemoryQueryBus} from "../shared/queries/InMemoryQueryBus";

export default function registerSharedDependencies(container: ContainerBuilder){
    container.register('EventBus', InMemoryEventBus)
    container.register('CommandHandlers', CommandHandlers)
    container.register('CommandBus', InMemoryCommandBus).addArgument(new Reference('CommandHandlers'))
    container.register('QueryHandlers', QueryHandlers)
    container.register('QueryBus', InMemoryQueryBus).addArgument(new Reference('QueryHandlers'))
    container.register('HealthController', HealthController);

    return container;
}