import { Subject, Observable } from 'rxjs';

export interface IEvent<P extends object> {
  push(payload: P, channelId: string | null): void;

  pull(): Observable<{ payload: P; channelId: string | null }>;
}

abstract class AbstractEvent<P extends object> implements IEvent<P> {
  private readonly observable = new Subject<{ channelId: string | null; payload: P }>();

  push(payload: P, channelId: string | null = null) {
    this.observable.next({ channelId, payload });
  }

  pull() {
    return this.observable;
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
