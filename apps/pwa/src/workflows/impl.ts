import { inject } from 'inversify';
import { firstValueFrom } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { assert } from 'ts-essentials';
import { matchesSchema } from '~/shared/type-guards';
import { TOKENS } from '~/shared/constants/di';
import { ModalCloseEvent, ModalShowEvent, NotificationShowEvent } from '~/shared/events';
import { WebRTC } from '~/shared/impl/webrtc';
import { nanoid } from 'nanoid';
import { IConnection, IEventBus, INotification, IPrompt } from './types';
import { z } from 'zod';
import { Subject } from 'rxjs';

const workflowMessageSchema = z.object({
  channelId: z.string(),
  type: z.literal('workflow'),
  payload: z.object({
    type: z.string(),
    value: z.unknown(),
  }),
});

export class Connection implements IConnection {
  private channelId: string | null = null;
  private isChannelStarted = false;

  constructor(@inject(TOKENS.WEB_RTC) private readonly webrtc: WebRTC) {}

  startChannel(channelId = nanoid()) {
    this.isChannelStarted = true;
    this.channelId = channelId;
  }

  endChannel() {
    this.isChannelStarted = false;
    this.channelId = null;
  }

  listen(type: string, cb: (msg: unknown) => void) {
    this.webrtc.on(
      'message',
      this.wrapMessageHandler({
        type,
        cb: (message) => {
          cb(message);
        },
      }),
    );
  }

  send(type: string, value: unknown) {
    this.webrtc.sendMessage({
      channelId: this.channelId,
      type: 'workflow',
      payload: {
        type,
        value,
      },
    });
  }

  receive(type: string, filters?: z.ZodSchema) {
    return new Promise<unknown>((resolve) => {
      const unsub = this.webrtc.on(
        'message',
        this.wrapMessageHandler({
          type,
          filters,
          cb: (message) => {
            unsub();
            resolve(message);
          },
        }),
      );
    });
  }

  close() {
    this.webrtc.close();
  }

  onclose(cb: VoidFunction) {
    return this.webrtc.on('disconnected', cb);
  }

  private wrapMessageHandler({
    type,
    filters,
    cb,
  }: {
    type: string;
    filters?: z.ZodSchema;
    cb: (msg: z.infer<typeof workflowMessageSchema>['payload']['value']) => void;
  }) {
    return (message: string) => {
      const json = JSON.parse(message);
      assert(matchesSchema(json, workflowMessageSchema), 'Invalid workflow message');

      if (json.payload.type === type) {
        if (!this.isChannelStarted) {
          this.startChannel(json.channelId);
        }

        if (this.channelId === json.channelId && (!filters || matchesSchema(json.payload.value, filters))) {
          cb(json.payload.value);
        }
      }
    };
  }
}

export class Prompt implements IPrompt {
  constructor(
    @inject(TOKENS.EVENTS.MODAL_SHOW) private readonly modalShow: ModalShowEvent,
    @inject(TOKENS.EVENTS.MODAL_CLOSE) private readonly modalClose: ModalCloseEvent,
  ) {}

  async question(question: string /*description?: string*/) {
    const channelId = '';
    const promise = firstValueFrom(
      this.modalClose.pull().pipe(
        filter((payload) => payload.channelId === channelId),
        first(),
        map(({ payload }) => payload.answer),
      ),
    );

    this.modalShow.push({
      type: 'prompt',
      question,
    });

    return promise;
  }
}

export class Notification implements INotification {
  constructor(@inject(TOKENS.EVENTS.NOTIFICATION_SHOW) private readonly notificationShow: NotificationShowEvent) {}

  success(message: string) {
    this.notificationShow.push({ type: 'success', message });
  }

  info(message: string) {
    this.notificationShow.push({ type: 'info', message });
  }

  error(message: string) {
    this.notificationShow.push({ type: 'error', message });
  }

  warning(message: string) {
    this.notificationShow.push({ type: 'warning', message });
  }
}

export class EventBus implements IEventBus {
  private observable = new Subject<{ type: string; payload: unknown }>();

  send(type: string, payload?: unknown) {
    this.observable.next({ type, payload });
  }

  receive(type: string) {
    return firstValueFrom(
      this.observable.pipe(
        filter((event) => {
          return event.type === type;
        }),
        map(({ payload }) => payload),
      ),
    );
  }

  listen(type: string, cb: (msg: unknown) => void) {
    return this.observable
      .pipe(
        filter((event) => {
          return event.type === type;
        }),
        map(({ payload }) => payload),
      )
      .subscribe(cb);
  }
}
