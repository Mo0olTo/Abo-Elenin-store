import { NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';
import { HomeSectionTitle } from '../../../../shared/ui/home-section-title/home-section-title';
import { AboutStory } from '../../models/about-story.model';

@Component({
  selector: 'app-about-us',
  imports: [HomeSectionTitle, NgOptimizedImage],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs {
  protected readonly stories: readonly AboutStory[] = [
    {
      eyebrow: 'Since 1990',
      title: 'A house of optics',
      description:
        'Abo Elenin Glasses began as a neighborhood atelier and grew into a house known for precise fitting, honest advice, and frames that last. More than three decades on, we still choose every pair the way we started — by looking at the person, not just the shelf.',
      image: '/images/hero/man-2.webp',
      imageAlt: 'A man wearing Abo Elenin optical frames',
      imageOnEnd: false,
    },
    {
      eyebrow: 'Crafted for today',
      title: 'Every face, a frame',
      description:
        'From quiet everyday lenses to statement sunglasses, the collection is built to move between streets, work, and evening light. We pair contemporary silhouettes with the same care at the fitting table — so the frame feels like it was waiting for you.',
      image: '/images/hero/woman-2.webp',
      imageAlt: 'A woman wearing Abo Elenin optical frames',
      imageOnEnd: true,
    },
  ];

  private readonly pointerX = signal(50);
  private readonly pointerY = signal(50);
  protected readonly activeStory = signal(-1);

  protected frameStyle(index: number): Record<string, string> {
    const isActive = this.activeStory() === index;

    return {
      '--tilt-x': isActive ? `${(this.pointerY() - 50) / -10}deg` : '0deg',
      '--tilt-y': isActive ? `${(this.pointerX() - 50) / 10}deg` : '0deg',
      '--pan-x': isActive ? `${(this.pointerX() - 50) / 6}px` : '0px',
      '--pan-y': isActive ? `${(this.pointerY() - 50) / 6}px` : '0px',
    };
  }

  protected onPointerMove(event: PointerEvent, index: number): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.activeStory.set(index);
    this.pointerX.set(((event.clientX - rect.left) / rect.width) * 100);
    this.pointerY.set(((event.clientY - rect.top) / rect.height) * 100);
  }

  protected onPointerLeave(): void {
    this.activeStory.set(-1);
    this.pointerX.set(50);
    this.pointerY.set(50);
  }
}
