/*

const event = eventBus.register<{ id: string }>(Symbol.for("eventA"))
event.next({ id: "123" });
event.pipe(filter(({ id }) => id === "123")).subscribe();

eventBus.publish(Symbol.for("eventA"), { id: "123" });

*/

import { Subject } from 'rxjs';
import { injectable } from 'inversify';

@injectable()
export class EventBus {
  private events: { [key: symbol]: Subject<any> } = {};

  register<T>(eventType: symbol): Subject<T> {
    if (!this.events[eventType]) {
      this.events[eventType] = new Subject<T>();
    }

    return this.events[eventType];

  }

  publish<T>(eventType: symbol, payload: T): void {
    if (this.events[eventType]) {
      this.events[eventType].next(payload);
    }
  }
}
