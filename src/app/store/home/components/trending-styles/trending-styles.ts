import { Component } from '@angular/core';
import { TrendingStyle } from '../../models/trending-style.model';

@Component({
  selector: 'app-trending-styles',
  imports: [],
  templateUrl: './trending-styles.html',
  styleUrl: './trending-styles.scss',
})
export class TrendingStyles {
  protected readonly styles: readonly TrendingStyle[] = [
    {
      title: 'BlackOut Summer',
      image: '/images/hero/woman-1.webp',
      imageAlt: 'BlackOut Summer look',
    },
    {
      title: 'Spectus The In-Between',
      image: '/images/hero/woman-2.webp',
      imageAlt: 'Spectus The In-Between look',
    },
    {
      title: 'Babamio Dreamers',
      image: '/images/hero/man-3.webp',
      imageAlt: 'Babamio Dreamers look',
    },
  ];
}
