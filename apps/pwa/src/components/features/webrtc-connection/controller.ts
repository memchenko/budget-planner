import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { makeAutoObservable, when } from 'mobx';
import { TOKENS } from '~/shared/constants/di.js';
import { WebRTC } from '~/shared/impl/webrtc/index.js';
import { assert } from 'ts-essentials';
import { matchesSchema } from '~/shared/type-guards.js';
import { readyEventTypeSchema, webRtcDescriptionSchema, webRtcMessageSchema } from '~/shared/events/schemas';

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
  mode: Mode | null = null;
  state: State = State.IDLE;
  private isWebRTCInitialized = false;

  onReady?: VoidFunction;

  get shouldDisplayButtons() {
    return this.state === State.IDLE;
  }

  get shouldReadCode() {
    return this.state === State.READING_QR;
  }

  get shouldDisplayQrCode() {
    return this.state === State.SHOWING_QR;
  }

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

  get isEstablished() {
    return this.state === State.ESTABLISHED;
  }

  get progressText() {
    switch (this.state) {
      case State.CREATING_OFFER: {
        return 'Preparing connection settings';
      }
      case State.ESTABLISHING_CONNECTION: {
        return 'Establishing connection';
      }
      default: {
        return 'Loading...';
      }
    }
  }

  get shouldDisplayProgress() {
    return [State.CREATING_OFFER, State.ESTABLISHING_CONNECTION].includes(this.state);
  }

  constructor(
    @inject(TOKENS.WEB_RTC)
    private readonly webrtc: WebRTC,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.setupWebRTC();

    when(() => this.state === State.CREATING_OFFER, this.createOffer);
    when(() => this.state === State.ESTABLISHED, this.handleEstablished);
  }

  initiateOffering() {
    this.mode = Mode.OFFERER;
    this.state = State.CREATING_OFFER;
  }

  initiateAnswering() {
    this.mode = Mode.ANSWERER;
    this.state = State.READING_QR;
  }

  async createOffer() {
    if (this.isWebRTCInitialized) {
      return;
    }

    this.isWebRTCInitialized = true;

    const offer = await this.webrtc.initiate();

    assert(offer !== null, "Couldn't initiate webrtc");

    this.state = State.SHOWING_QR;
  }

  readAnswer() {
    this.state = State.READING_QR;
  }

  async handleQRCodes(value: string) {
    if (this.state === State.IDLE) {
      return;
    }

    try {
      const json = JSON.parse(value);
      assert(matchesSchema(json, webRtcDescriptionSchema));

      this.state = State.IDLE;

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

  private handleWebRTCMessage(json: unknown) {
    assert(matchesSchema(json, webRtcMessageSchema), 'Invalid webrtc message');

    if (json.type === readyEventTypeSchema.value) {
      this.state = State.ESTABLISHED;
    }
  }

  reset() {
    this.mode = null;
    this.state = State.IDLE;
  }
}
