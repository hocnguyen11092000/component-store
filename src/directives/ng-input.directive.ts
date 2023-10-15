import { Directive } from "@angular/core";

@Directive({
  selector: '[ng-input]',
  exportAs: 'ngInput',
  standalone: true
})
export class NgInput {

}