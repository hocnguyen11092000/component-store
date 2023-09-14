import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

export type StoreState<TStore> = TStore extends ComponentStore<infer TState>
  ? TState
  : {};

export type StoreSelectors<TStore, TStoreState = StoreState<TStore>> = {
  [TSelectorKey in keyof TStoreState &
    string as `${TSelectorKey}$`]: Observable<TStoreState[TSelectorKey]>;
};

class SomeStore extends ComponentStore<{ foo: string; bar: number }> {}
declare const selectors: StoreSelectors<SomeStore>;

// declare function getSelectors<TStore extends ComponentStore<any>>(store: TStore): StoreSelectors<TStore>

export function getSelectors<TStore>(store: TStore): StoreSelectors<TStore> {
  return new Proxy<StoreSelectors<TStore>>({} as StoreSelectors<TStore>, {
    get(target, p, reciver) {
      const prop = p as string;

      if (
        !prop.endsWith('$') ||
        target[prop as keyof StoreSelectors<TStore>] != null
      ) {
        return Reflect.get(target, p, reciver);
      }

      const stateProp = prop.slice(0, -1);
      return (target[prop as keyof StoreSelectors<TStore>] = (
        store as ComponentStore<any>
      ).select((s) => s[stateProp]) as any);
    },
  });
}
