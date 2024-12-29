import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { observable, action, makeAutoObservable } from 'mobx';
import { TOKENS } from '~/shared/constants/di';
import { WebRTC } from '~/shared/impl/webrtc';
import { Synchronizer } from '~/shared/impl/syncronizer';
import { WebRTCMessage } from '~/shared/schemas/webrtc';

@provide(P2PSynchronizationController)
export class P2PSynchronizationController {
  @observable shouldDisplayProgress = false;
  @observable isSynchronized = false;

  constructor(
    @inject(TOKENS.WEB_RTC) private readonly webrtc: WebRTC<WebRTCMessage>,
    @inject(TOKENS.SYNCHRONIZER) private readonly synchronizer: Synchronizer,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.webrtc.on('error', (err: any) => {
      console.log(err);
    });
  }

  @action
  handleWebRTCConnected() {
    this.shouldDisplayProgress = true;

    if (this.webrtc.isInitiator) {
      this.synchronizer.initiate();
    }
  }
}
