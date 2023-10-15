import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  TemplateRef,
  ContentChild,
  OnInit,
  AfterContentInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormControlDirective,
  FormControlName,
  NgControl,
  NgModel,
} from '@angular/forms';
import * as _ from 'lodash';
import { debounceTime, tap } from 'rxjs';
import { StringTemplateOutlet } from 'src/directives/string-template-outlet.directive';
import { AbstractControlWarn } from 'src/interfaces';
import { FormWarn } from 'src/abstracts';
@Component({
  selector: '<app-show-warning-helper/>',
  template: `
    <style>
      .show-warning-message {
        color: #ff9b50;
      }
    </style>
    <div class="show-warning-container">
      <ng-content></ng-content>

      <div class="show-warning-message" *ngIf="innerTip">
        <ng-container
          *stringTemplateOutlet="
            innerTip;
            context: { $implicit: validateControl }
          "
          >{{ innerTip }}</ng-container
        >
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StringTemplateOutlet, CommonModule],
})
export class ShowHelperWarningComponent implements OnInit, AfterContentInit {
  private cdr = inject(ChangeDetectorRef);

  @Input() warningTip!:
    | string
    | TemplateRef<{ $implicit: AbstractControl | NgModel }>;

  @ContentChild(NgControl, { static: false }) defaultValidateControl?:
    | FormControlName
    | FormControlDirective;

  validateControl: AbstractControlWarn | NgModel | null = null;
  innerTip:
    | string
    | TemplateRef<{ $implicit: AbstractControl | NgModel }>
    | null = null;

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    console.log(this.defaultValidateControl);

    if (this.defaultValidateControl instanceof FormControlName) {
      this.validateControl = this.defaultValidateControl
        .control as AbstractControlWarn;

      this.cdr.markForCheck();
    }

    this.validateControl?.valueChanges
      ?.pipe(
        tap(() => {
          if (this.validateControl instanceof FormWarn) {
            this.innerTip = this.validateControl?.hasWarning('minlength')
              ? this.warningTip
              : null;
          }

          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }
}
