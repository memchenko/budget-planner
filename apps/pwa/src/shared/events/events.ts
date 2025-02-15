import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

interface EventData<P> {
  payload: P;
  channelId: string | null;
}

export interface IEvent<P extends object> {
  push(payload: P, channelId: string | null): void;

  pull(): Observable<EventData<P>>;
}

abstract class AbstractEvent<P extends object> implements IEvent<P> {
  private readonly observable = new BehaviorSubject<EventData<P> | null>(null);

  push(payload: P, channelId: string | null = null) {
    this.observable.next({ channelId, payload });
  }

  pull(): Observable<EventData<P>> {
    return this.observable.pipe(filter((value): value is EventData<P> => value !== null));
  }
}

export class UserReadyEvent extends AbstractEvent<object> {}

export class ModalShowEvent extends AbstractEvent<{
  type: 'prompt';
  question: string;
  description?: string;
}> {}

export class ModalCloseEvent extends AbstractEvent<{
  answer: string;
}> {}

export class NotificationShowEvent extends AbstractEvent<{
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}> {}
