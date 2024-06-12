import type { IController, ControllerEvents } from './types';
import { Observable } from '../misc/observable';

export abstract class BaseController extends Observable<ControllerEvents> implements IController {
  abstract initialize(): void;
}

export * from './decorators';
export * from './hooks';
export * from './types';
