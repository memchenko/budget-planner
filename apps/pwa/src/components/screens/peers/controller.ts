import { provide } from 'inversify-binding-decorators';
import { makeAutoObservable } from 'mobx';
import { inject } from 'inversify';
import { TOKENS } from '~/shared/constants/di';
import * as user from '~/stores/user';
import { WebRTC } from '~/shared/impl/webrtc';
import { IEventBus, WORKFLOW_TOKENS, LOCAL_EVENTS } from '~/workflows/types';

@provide(PeersController)
export class PeersController {
  constructor(
    @inject(TOKENS.USER_STORE)
    private readonly userStore: user.User,
    @inject(TOKENS.WEB_RTC) private readonly webrtc: WebRTC,
    @inject(WORKFLOW_TOKENS.IEventBus) private readonly eventBus: IEventBus,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.webrtc.on('error', (err: any) => {
      console.log(err);
    });
  }

  get hasAnyPeer() {
    return this.userStore.hasAnyExternal;
  }

  get peers() {
    return this.userStore.externals;
  }

  isUserConnected(id: user.EntityType['id']) {
    return this.userStore.connectedUsers.has(id);
  }

  forgetPeer() {}

  connect() {
    if (this.webrtc.isInitiator) {
      this.eventBus.send(LOCAL_EVENTS.START_GREETING);
    }
  }
}
