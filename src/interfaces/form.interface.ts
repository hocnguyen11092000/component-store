import { AbstractControl } from '@angular/forms';

export interface AbstractControlWarn extends AbstractControl {
  warnings?: WraningType<{}>;
  hasWarnings?: () => boolean;
}

export type WraningType<TData extends object> = {
  [WarningKey in keyof TData]: TData[WarningKey];
};
