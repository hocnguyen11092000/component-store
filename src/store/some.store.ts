import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { getSelectors } from './get-selector';

export interface SomeState {
  foo: string;
  bar: number;
  flag: boolean;
}

const initialState: SomeState = {
  foo: 'Testing foo',
  bar: 0,
  flag: false,
};

@Injectable()
export class SomeStore extends ComponentStore<SomeState> {
  readonly selectors = getSelectors<ComponentStore<SomeState>>(this);
  readonly vm$ = this.select(
    this.selectors.foo$,
    this.selectors.bar$,
    this.selectors.flag$,
    (foo, bar, flag) => ({
      foo,
      bar,
      derived: flag ? true : false,
    })
  );

  constructor() {
    super(initialState);
  }
}
