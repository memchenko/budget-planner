import 'reflect-metadata';
import { Container } from 'inversify';

interface Global {
  container: Container;
  [_: string]: unknown;
}

declare global {
  // eslint-disable-next-line no-var
  var container: Container;
}
