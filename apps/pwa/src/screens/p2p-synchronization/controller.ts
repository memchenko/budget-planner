import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { observable, action, makeAutoObservable } from 'mobx';
import { TOKENS } from '~/shared/app/di.js';
import { WebRTC } from '~/modules/webrtc/index.js';
import { WebRTCMessage, newRecordEventTypeSchema } from '~/shared/schemas/webrtc';

let counter = 0;

@provide(P2PSynchronizationController)
export class P2PSynchronizationController {
  @observable shouldDisplayProgress = false;
  @observable isSynchronized = false;

  constructor(@inject(TOKENS.WebRTC) private readonly webrtc: WebRTC<WebRTCMessage>) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.webrtc.on('message', this.handleWebRTCMessage);
    this.webrtc.on('error', (err: any) => {
      console.log(err);
    });
  }

  @action
  handleWebRTCConnected() {
    this.shouldDisplayProgress = true;

    this.webrtc.sendMessage({
      type: 'new-record',
      payload: {
        entity: 'user',
        value: {
          id: `${this.webrtc.isInitiator ? 'OFFERER' : 'ANSWERER'}: ${++counter}`,
          firstName: '',
          lastName: '',
          avatarSrc: '',
        },
      },
    });
  }

  handleWebRTCMessage(msg: WebRTCMessage) {
    if (msg.type === newRecordEventTypeSchema.value) {
      this.webrtc.sendMessage({
        type: 'new-record',
        payload: {
          entity: 'user',
          value: {
            id: `${this.webrtc.isInitiator ? 'OFFERER' : 'ANSWERER'}: ${++counter}`,
            firstName: '',
            lastName: '',
            avatarSrc: '',
          },
        },
      });
    }
  }
}
