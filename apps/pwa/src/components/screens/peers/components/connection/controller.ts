import { provide } from 'inversify-binding-decorators';
import { makeAutoObservable } from 'mobx';
import { inject } from 'inversify';
import { TOKENS } from '~/shared/constants/di';
import { WebRTC } from '~/shared/impl/webrtc';
import { IEventBus, WORKFLOW_TOKENS, LOCAL_EVENTS } from '~/workflows/types';

@provide(ConnectionController)
export class ConnectionController {
  isInitiator = false;
  shouldStartConnecting = false;

  constructor(
    @inject(TOKENS.WEB_RTC) private readonly webrtc: WebRTC,
    @inject(WORKFLOW_TOKENS.IEventBus) private readonly eventBus: IEventBus,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.webrtc.on('error', (err: any) => {
      console.log(err);
    });
  }

  initiate() {
    this.isInitiator = true;
    this.shouldStartConnecting = true;
  }

  answer() {
    this.isInitiator = false;
    this.shouldStartConnecting = true;
  }

  connect() {
    if (this.webrtc.isInitiator) {
      this.eventBus.send(LOCAL_EVENTS.START_GREETING);
    }
  }

  reset() {
    this.shouldStartConnecting = false;
    this.isInitiator = false;
  }
}
