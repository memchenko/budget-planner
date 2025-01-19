import { z } from 'zod';

export const WORKFLOW_TOKENS = {
  IPrompt: Symbol.for('IPrompt'),
  INotification: Symbol.for('INotification'),
  IConnection: Symbol.for('IConnection'),
  IEventBus: Symbol.for('IEventBus'),
};

export const PEER_EVENTS = {
  GREET: 'greet',
  SYNC: 'sync',
  SYNC_ENTITY: 'sync-entity',
  ENTITY_ACCEPTED: 'entity-accepted',
};

export const LOCAL_EVENTS = {
  START_GREETING: 'start-greeting',
  GREETED_PEER: 'greeted-peer',
  START_SYNCING_ENTITY: 'start-syncing-entity',
  STOP_SYNCING_ENTITY: 'stop-syncing-entity',
};

export interface IWorkflow {
  execute(initData?: unknown): Promise<void>;
}

export interface ICooperativeWorkflow extends IWorkflow {
  answer(initData?: unknown): Promise<void>;
}

export interface IAutoWorkflow extends IWorkflow {}

export type IConnection = {
  startChannel: VoidFunction;
  endChannel: VoidFunction;
  send: (type: string, message: unknown) => void;
  receive: <T extends z.ZodSchema>(type: string, filters?: T) => Promise<z.infer<T>>;
  listen: (type: string, cb: (msg: unknown) => void) => void;
  close: VoidFunction;
  onclose: (cb: VoidFunction) => VoidFunction;
};

export type IPrompt = {
  question: (question: string, description?: string) => Promise<string>;
};

export type INotification = {
  success: (text: string) => void;
  info: (text: string) => void;
  error: (text: string) => void;
  warning: (text: string) => void;
};

export type IEventBus = {
  send: (type: string, message?: unknown) => void;
  receive: (type: string) => Promise<unknown>;
  listen: (type: string, cb: (msg: unknown) => void) => void;
};
