import {Query, QueryBus, QueryHandler, QueryHandlerNotRegisteredError, Response} from "arena-split-core";
import QueryHandlers from "./QueryHandlers";

export class InMemoryQueryBus implements QueryBus {
    constructor(private readonly queryHandlers: QueryHandlers) {
    }

    async ask<R extends Response>(query: Query): Promise<R> {
        const handler = this.queryHandlers.get(query);

        this.ensureHandlerExists(handler, query);

        const response = await handler.handle(query);
        return response as R;
    }

    private ensureHandlerExists(handler: QueryHandler<Query, Response>, query: Query) {
        if (!handler) {
            throw new QueryHandlerNotRegisteredError(query);
        }
    }

}