import {DomainEvent, DomainEventSubscriber} from "arena-split-core";
import {EventEmitter} from "node:events";
import {EventBus} from "arena-split-core";

export class InMemoryEventBus extends EventEmitter implements EventBus {
    async publish(...events: DomainEvent[]): Promise<void> {
        events.forEach(event => {
            this.emit(event.eventName, event);
        });
    }

    addSubscribers(...subscribers: DomainEventSubscriber<DomainEvent>[]) {
        subscribers.forEach(subscriber => this.addSubscriber(subscriber));
    }

    addSubscriber(subscriber: DomainEventSubscriber<DomainEvent>): void {
        subscriber.subscribedTo().forEach(event => this.on(event.EVENT_NAME, subscriber.on.bind(subscriber)));
    }
}