import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { TOKENS } from '~/shared/constants/di';
import { pages } from '~/shared/constants/pages';
import { WebRTC } from '~/shared/impl/webrtc';
import { INavigateFunc } from '~/shared/interfaces';
import { IEventBus, WORKFLOW_TOKENS, LOCAL_EVENTS } from '~/workflows/types';

@provide(ConnectionController)
export class ConnectionController {
  constructor(
    @inject(TOKENS.WEB_RTC) private readonly webrtc: WebRTC,
    @inject(TOKENS.NAVIGATE_FUNC) private readonly navigate: INavigateFunc,
    @inject(WORKFLOW_TOKENS.IEventBus) private readonly eventBus: IEventBus,
  ) {
    this.webrtc.on('error', (err: any) => {
      console.log(err);
    });
  }

  handleWebRTCConnected = () => {
    if (this.webrtc.isInitiator) {
      this.eventBus.send(LOCAL_EVENTS.START_GREETING);
    }
    this.navigate(pages.index);
  };
}
