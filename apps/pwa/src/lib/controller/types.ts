import { IObservable } from '../misc/observable';

export type ParamType<T> = T & { __type: T };

type AllProperties<C extends {}> = {
  [K in keyof C]: C[K] extends ParamType<infer T> ? T : never;
};
type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
type OmitMatching<T, V> = Omit<T, KeysMatching<T, V>>;
export type Props<T extends {}> = OmitMatching<AllProperties<T>, never>;

export type ControllerEvents = {
  updated: null;
};

export interface IController extends IObservable<ControllerEvents> {
  initialize(): void;
}
