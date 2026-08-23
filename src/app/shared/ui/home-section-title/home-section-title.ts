import { Component, input } from '@angular/core';

@Component({
  selector: 'app-home-section-title',
  imports: [],
  templateUrl: './home-section-title.html',
  styleUrl: './home-section-title.scss',
})
export class HomeSectionTitle {
  readonly title = input.required<string>();
  readonly subtitle = input('');
}
