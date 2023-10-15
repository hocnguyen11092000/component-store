import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  AbstractControl,
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
import * as moment from 'moment';

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
          <input
            maxlength="10"
            (change)="handleInput($event)"
            type="text"
            placeholder="input..."
            formControlName="name"
          />
        </app-show-warning-helper>
        {{ someForm.get('name')?.errors | json }}
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
      validators: [
        this.wraningMinLength(5).bind(this),
        this.dateValidator.bind(this),
      ],
    }),
  });

  ngOnInit(): void {
    console.log(moment('09/31/2000').format('MM-DD-YYYY'));
  }

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

  handleInput(e: Event) {
    const value = _.get(e, 'target.value') || '';
    const formatBirthDay = this.swap(value);
    const now = moment().format('MM/DD/YYYY');

    if (!isNaN(new Date(formatBirthDay).getTime())) {
      const isGreaterThanNow = this.isGreaterThanNow(now, formatBirthDay);
      // new Date(now).getTime() - new Date(formatBirthDay).getTime() < 0;
      console.log(isGreaterThanNow);
    }
  }

  isGreaterThanNow<D1 extends string | Date, D2 extends string | Date>(
    date1: D1,
    data2: D2
  ): boolean {
    return new Date(date1).getTime() - new Date(data2).getTime() < 0;
  }

  swap<T extends string = string>(
    input: T,
    swap = true,
    split = '/',
    join = '/'
  ): T | string {
    const [a, b, ...rest] = input.split(split);

    return swap ? [b, a, ...rest].join(join) : [a, b, ...rest].join(join);
  }

  dateValidator(control: AbstractControl) {
    const value = control.getRawValue();
    const transformToDate = this.swap(value);
    const now = moment().format('MM/DD/YYYY');

    if (
      isNaN(new Date(transformToDate).getTime()) ||
      _.size(transformToDate) < 10
    ) {
      return {
        inValidDate: true,
      };
    }

    const isGreaterThanNow = this.isGreaterThanNow(now, transformToDate);

    if (isGreaterThanNow) {
      return {
        inValidDate: true,
      };
    }

    return null;
  }
}
