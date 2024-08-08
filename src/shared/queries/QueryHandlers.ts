import {Query, QueryHandler, QueryHandlerNotRegisteredError, Response} from "arena-split-core";

export default class QueryHandlers extends Map<Query, QueryHandler<Query, Response>> {
    public put(queryHandler: QueryHandler<Query, Response>) {
        this.set(queryHandler.subscribedTo(), queryHandler);
    }

    public get(query: Query): QueryHandler<Query,Response> {
        const queryHandler = super.get(query.constructor);

        if (!queryHandler) {
            throw new QueryHandlerNotRegisteredError(query);
        }

        return queryHandler;
    }
}