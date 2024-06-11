export interface IObservable<EventsPayloadMap extends {}> {
  on<K extends keyof EventsPayloadMap>(event: K, fn: (data?: EventsPayloadMap[K]) => void): VoidFunction;
  off<K extends keyof EventsPayloadMap>(event: K, fn: (data?: EventsPayloadMap[K]) => void): void;
  emit<K extends keyof EventsPayloadMap>(event: K, payload?: EventsPayloadMap[K]): void;
}

export class Observable<EventsPayloadMap extends {}> implements IObservable<EventsPayloadMap> {
  private subscribers: {
    [K in keyof EventsPayloadMap]?: Array<(payload?: EventsPayloadMap[K]) => void>;
  } = {};
  on<K extends keyof EventsPayloadMap>(event: K, cb: (payload?: EventsPayloadMap[K]) => void) {
    const subs = this.subscribers[event];

    if (subs !== undefined) {
      subs.push(cb);
    } else {
      this.subscribers[event] = [cb];
    }

    return () => {
      this.off(event, cb);
    };
  }
  off<K extends keyof EventsPayloadMap>(event: K, cb: (data: EventsPayloadMap[K]) => void) {
    this.subscribers[event] = this.subscribers[event]?.filter((item) => item !== cb);
  }
  emit<K extends keyof EventsPayloadMap>(event: K, payload?: EventsPayloadMap[K]) {
    this.subscribers[event]?.forEach((cb) => {
      cb(payload);
    });
  }
}
