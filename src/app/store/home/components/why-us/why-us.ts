import { Component } from '@angular/core';
import { HomeSectionTitle } from '../../../../shared/ui/home-section-title/home-section-title';
import { WhyUsFeature } from '../../models/why-us-feature.model';

@Component({
  selector: 'app-why-us',
  imports: [HomeSectionTitle],
  templateUrl: './why-us.html',
  styleUrl: './why-us.scss',
})
export class WhyUs {
  protected readonly features: readonly WhyUsFeature[] = [
    { title: 'Quality Frames', icon: 'frames' },
    { title: 'Affordable Prices', icon: 'price' },
    { title: 'Easy WhatsApp Ordering', icon: 'whatsapp' },
    { title: 'Fast Delivery', icon: 'delivery' },
  ];
}
