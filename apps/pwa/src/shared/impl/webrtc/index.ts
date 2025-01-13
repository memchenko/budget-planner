import { injectable } from 'inversify';

interface Events {
  connected: VoidFunction;
  ready: VoidFunction;
  disconnected: VoidFunction;
  message: (message: string) => void;
  error: (error: Error) => void;
}

@injectable()
export class WebRTC {
  private pc: RTCPeerConnection;
  private dc: RTCDataChannel | null = null;
  isInitiator: boolean = false;

  private emitOffer = () => {};
  private emitAnswer = () => {};

  get offer() {
    return this.isInitiator ? this.pc.localDescription : this.pc.remoteDescription;
  }

  get answer() {
    return this.isInitiator ? this.pc.remoteDescription : this.pc.localDescription;
  }

  private listeners: {
    [K in keyof Events]?: Events[K][];
  } = {};

  on<E extends keyof Events>(event: E, listener: Events[E]) {
    if (Array.isArray(this.listeners[event])) {
      this.listeners[event]?.push(listener);
    } else {
      (this.listeners[event] as unknown as Events[E][]) = [listener];
    }

    return () => this.off(event, listener);
  }

  off<E extends keyof Events>(event: E, listener: Events[E]) {
    if (Array.isArray(this.listeners[event])) {
      (this.listeners[event] as unknown as Events[E][]) = this.listeners[event]!.filter((_listener) => {
        return _listener !== listener;
      });
    }
  }

  emit<E extends keyof Events>(event: E, ...payload: Events[E] extends (...args: infer P) => any ? P : never) {
    if (Array.isArray(this.listeners[event])) {
      this.listeners[event]?.forEach((listener) => {
        (listener as CallableFunction)(...payload);
      });
    }
  }

  constructor() {
    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:23.21.150.121' }],
    });
    this.setupPeerConnection();
  }

  private setupPeerConnection() {
    this.pc.onicecandidate = (e) => {
      if (e.candidate === null) {
        // ICE gathering completed
        if (this.isInitiator) {
          this.emitOffer();
        } else {
          this.emitAnswer();
        }
      }
    };

    this.pc.onconnectionstatechange = () => {
      if (this.pc.connectionState === 'connected') {
        this.emit('connected');
      }
    };

    this.pc.ondatachannel = (e) => {
      this.setupDataChannel(e.channel);
    };
  }

  private setupDataChannel(channel: RTCDataChannel) {
    this.dc = channel;

    this.dc.onopen = () => {
      this.emit('ready');
    };

    this.dc.onclose = () => {
      this.emit('disconnected');
    };

    this.dc.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data);

        this.emit('message', message);
      } catch (err) {
        this.emit('error', new Error('Error when getting message', { cause: err }));
      }
    };
  }

  public async initiate(): Promise<RTCSessionDescription | null> {
    this.isInitiator = true;
    try {
      this.dc = this.pc.createDataChannel('json-channel', { ordered: true });
      this.setupDataChannel(this.dc);

      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      return new Promise((resolve) => {
        // Wait for ICE gathering to complete
        if (this.pc.iceGatheringState === 'complete') {
          resolve(this.pc.localDescription);
        } else {
          this.emitOffer = () => {
            resolve(this.pc.localDescription);
          };
        }
      });
    } catch (err) {
      this.emit('error', err as Error);
      throw err;
    }
  }

  public async handleOffer(offer: Omit<RTCSessionDescription, 'toJSON'>): Promise<RTCSessionDescription | null> {
    this.isInitiator = false;
    try {
      await this.pc.setRemoteDescription(offer);
      this.pc.ondatachannel = (event: Event & { channel: RTCDataChannel }) => {
        this.setupDataChannel(event.channel);
      };

      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);

      return new Promise((resolve) => {
        // Wait for ICE gathering to complete
        if (this.pc.iceGatheringState === 'complete') {
          resolve(this.pc.localDescription);
        } else {
          this.emitAnswer = () => {
            resolve(this.pc.localDescription);
          };
        }
      });
    } catch (err) {
      this.emit('error', err as Error);
      throw err;
    }
  }

  public async handleAnswer(answer: Omit<RTCSessionDescription, 'toJSON'>): Promise<void> {
    try {
      await this.pc.setRemoteDescription(answer);
    } catch (err) {
      this.emit('error', err as Error);
      throw err;
    }
  }

  public sendMessage(message: unknown) {
    if (!this.dc || this.dc.readyState !== 'open') {
      this.emit('error', new Error('Connection not ready'));
      return;
    }

    try {
      this.dc.send(JSON.stringify(message));
    } catch (err) {
      this.emit('error', err as Error);
    }
  }

  public close() {
    if (this.dc) {
      this.dc.close();
    }
    this.pc.close();
  }
}
