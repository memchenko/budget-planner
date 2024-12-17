import { fluentProvide } from 'inversify-binding-decorators';

export const provideSingleton = (identifier: Parameters<typeof fluentProvide>[0]) => {
  return fluentProvide(identifier).inSingletonScope().done();
};
