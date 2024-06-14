import { injectable } from 'inversify';
import type { IController, ControllerEvents } from './types';
import { Observable } from '../misc/observable';

@injectable()
export class BaseController extends Observable<ControllerEvents> implements IController {
  initialize() {}
}

export * from './decorators';
export * from './hooks';
export * from './types';
