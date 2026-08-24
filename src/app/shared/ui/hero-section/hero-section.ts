import { Component, computed, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  readonly englishName = input('ABO EL ENIN');
  readonly category = input('OPTICS');
  readonly since = input('Since 1990');

  protected readonly images = [
    '/images/hero/man-1.webp',
    '/images/hero/man-2.webp',
    '/images/hero/man-3.webp',
    '/images/hero/woman-1.webp',
    '/images/hero/woman-2.webp',
    '/images/hero/woman-3.webp',
  ] as const;

  protected readonly activeIndex = signal(0);
  protected readonly pointerX = signal(50);
  protected readonly pointerY = signal(50);

  protected readonly sceneStyle = computed(() => ({
    '--tilt-x': `${(this.pointerY() - 50) / -12}deg`,
    '--tilt-y': `${(this.pointerX() - 50) / 12}deg`,
    '--pan-x': `${(this.pointerX() - 50) / 8}px`,
    '--pan-y': `${(this.pointerY() - 50) / 8}px`,
  }));

  constructor() {
    interval(3500)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.activeIndex.update((index) => (index + 1) % this.images.length);
      });
  }

  protected onPointerMove(event: PointerEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.pointerX.set(((event.clientX - rect.left) / rect.width) * 100);
    this.pointerY.set(((event.clientY - rect.top) / rect.height) * 100);
  }

  protected onPointerLeave(): void {
    this.pointerX.set(50);
    this.pointerY.set(50);
  }
}
