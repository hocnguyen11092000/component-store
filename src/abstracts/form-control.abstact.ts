import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { WraningType } from 'src/interfaces/form.interface';

export class FormWarn extends FormControl {
  warnings: WraningType<{}> = {};

  hasWarning(type: string) {
    if (!type) return undefined;

    return !!_.get(this.warnings, type);
  }
}
