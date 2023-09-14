import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as _ from 'lodash';
import { FormWarn } from 'src/abstracts';
import { AbstractControlWarn } from 'src/interfaces/form.interface';
import { TypedFormGroup } from 'src/utils/typed-form';
import { tap } from 'rxjs';
import { ShowHelperWarningComponent } from './show-warning-helper.component';
import { CommonModule } from '@angular/common';

export interface ISomeForm {
  name: string;
}

@Component({
  selector: '<app-form-warning/>',
  template: `
    <h2>Warning control</h2>
    <form [formGroup]="someForm">
      <div class="form-group">
        <app-show-warning-helper [warningTip]="warningTemplate">
          <input type="text" placeholder="input..." formControlName="name" />
        </app-show-warning-helper>
      </div>
    </form>

    <ng-template #warningTemplate let-control>
      <ng-container *ngIf="control?.hasWarning('minlength')">
        Warning from min length
      </ng-container>
    </ng-template>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ShowHelperWarningComponent, CommonModule],
})
export class FormWarningComponent implements OnInit {
  private fb = inject(FormBuilder);
  readonly someForm: TypedFormGroup<ISomeForm> = this.fb.nonNullable.group({
    name: new FormWarn('', {
      validators: [this.wraningMinLength(5).bind(this)],
    }),
  });

  ngOnInit(): void {}

  //#endregion custom warning Validation
  wraningMinLength(length: number): ValidatorFn {
    return (control: AbstractControlWarn): ValidationErrors | null => {
      const value = _.get(control, 'value');

      if (!value || !length) {
        _.set(control, 'warnings', {});
        return null;
      }

      _.size(value) <= length
        ? _.set(control, 'warnings.minlength', length)
        : _.unset(control, 'warnings.minlength');

      return {};
    };
  }
}
