import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { observable, computed, action, makeAutoObservable, when } from 'mobx';
import { TOKENS } from '~/shared/app/di.js';
import { WebRTC } from '~/shared/impl/webrtc/index.js';
import { assert } from 'ts-essentials';
import { matchesSchema } from '~/shared/type-guards.js';
import { WebRTCMessage, readyEventTypeSchema, webRtcDescriptionSchema } from '~/shared/schemas/webrtc.js';

export enum Mode {
  OFFERER,
  ANSWERER,
}

export enum State {
  IDLE,
  CREATING_OFFER,
  SHOWING_QR,
  READING_QR,
  ESTABLISHING_CONNECTION,
  ESTABLISHED,
}

@provide(WebRTCConnectionController)
export class WebRTCConnectionController {
  @observable mode: Mode | null = null;
  @observable state: State = State.IDLE;

  onReady?: VoidFunction;

  @computed
  get shouldDisplayButtons() {
    return this.state === State.IDLE;
  }

  @computed
  get shouldReadCode() {
    return this.state === State.READING_QR;
  }

  @computed
  get shouldDisplayQrCode() {
    return this.state === State.SHOWING_QR;
  }

  @computed
  get qrCodeValue() {
    if (this.mode === Mode.ANSWERER) {
      assert(this.webrtc.answer !== null, 'Answer must be set to display qr code');
      return JSON.stringify(this.webrtc.answer);
    }

    if (this.mode === Mode.OFFERER) {
      assert(this.webrtc.offer !== null, 'Offer must be set to display qr code');
      return JSON.stringify(this.webrtc.offer);
    }

    throw new Error('Mode must be set to display qr code');
  }

  @computed
  get isEstablished() {
    return this.state === State.ESTABLISHED;
  }

  @computed
  get progressText() {
    switch (this.state) {
      case State.CREATING_OFFER: {
        return 'Setting up connection settings';
      }
      case State.ESTABLISHING_CONNECTION: {
        return 'Establishing connection';
      }
      default: {
        return 'Loading...';
      }
    }
  }

  @computed
  get shouldDisplayProgress() {
    return [State.CREATING_OFFER, State.ESTABLISHING_CONNECTION].includes(this.state);
  }

  constructor(
    @inject(TOKENS.WebRTC)
    private readonly webrtc: WebRTC<WebRTCMessage>,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.setupWebRTC();

    when(() => this.state === State.CREATING_OFFER, this.createOffer);
    when(() => this.state === State.ESTABLISHED, this.handleEstablished);
  }

  @action
  async initiateOffering() {
    this.mode = Mode.OFFERER;
    this.state = State.CREATING_OFFER;
  }

  @action
  initiateAnswering() {
    this.mode = Mode.ANSWERER;
    this.state = State.READING_QR;
  }

  @action
  async createOffer() {
    const offer = await this.webrtc.initiate();

    assert(offer !== null, "Couldn't initiate webrtc");

    this.state = State.SHOWING_QR;
  }

  @action
  readAnswer() {
    this.state = State.READING_QR;
  }

  @action
  async handleQRCodes(value: string) {
    try {
      const json = JSON.parse(value);
      assert(matchesSchema(json, webRtcDescriptionSchema));

      if (this.mode === Mode.ANSWERER) {
        await this.webrtc.handleOffer(json);
        this.state = State.SHOWING_QR;
      }

      if (this.mode === Mode.OFFERER) {
        await this.webrtc.handleAnswer(json);
        this.state = State.ESTABLISHING_CONNECTION;
      }
    } catch (e) {
      this.handleError(e);
    }
  }

  setupWebRTC() {
    this.webrtc.on('message', this.handleWebRTCMessage);
    this.webrtc.on('error', this.handleError);
    this.webrtc.on('connected', this.handleWebRTCConnected);
    this.webrtc.on('ready', this.handleWebRTCReady);
  }

  handleError(e: any) {
    throw e;
  }

  private handleEstablished() {
    this.webrtc.off('message', this.handleWebRTCMessage);
    this.webrtc.off('error', this.handleError);
    this.webrtc.off('connected', this.handleWebRTCConnected);
    this.webrtc.off('ready', this.handleWebRTCReady);

    this.onReady?.();
  }

  @action
  private handleWebRTCConnected() {
    this.state = State.ESTABLISHING_CONNECTION;
  }

  private handleWebRTCReady() {
    if (this.mode === Mode.ANSWERER) {
      this.webrtc.sendMessage({
        type: readyEventTypeSchema.value,
      });
      this.state = State.ESTABLISHED;
    }
  }

  private handleWebRTCMessage(msg: WebRTCMessage) {
    if (msg.type === readyEventTypeSchema.value) {
      this.state = State.ESTABLISHED;
    }
  }
}
