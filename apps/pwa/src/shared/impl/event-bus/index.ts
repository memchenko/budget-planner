/*

const event = eventBus.register<{ id: string }>(Symbol.for("eventA"))
event.next({ id: "123" });
event.pipe(filter(({ id }) => id === "123")).subscribe();

eventBus.publish(Symbol.for("eventA"), { id: "123" });

*/

import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { injectable } from 'inversify';
import has from 'lodash/has';

export interface Event<T extends string, P extends object> {
  type: T;
  payload: P;
}

@injectable()
export class EventBus {
  private observable = new Subject<unknown>();

  register<E extends Event<string, object>>(eventType: E['type']): Observable<E['payload']> {
    return this.observable.pipe(
      filter((event: unknown): event is E => {
        return has(event, 'type') && event.type === eventType;
      }),
      map(({ payload }) => payload),
    );
  }

  publish<E extends Event<string, object>>(eventType: E['type'], payload: E['payload']): void {
    this.observable.next({ type: eventType, payload });
  }
}
