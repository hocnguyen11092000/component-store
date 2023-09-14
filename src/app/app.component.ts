import { Component, OnInit, inject } from '@angular/core';
import { of } from 'rxjs';
import { FormWarningComponent } from 'src/components/form-warning.component';
import { SomeStore } from 'src/store/some.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  providers: [SomeStore],
  imports: [FormWarningComponent],
})
export class AppComponent implements OnInit {
  title = 'component-store';
  private someStore = inject(SomeStore);

  ngOnInit(): void {
    this.someStore.vm$.subscribe(console.log);
  }
}
