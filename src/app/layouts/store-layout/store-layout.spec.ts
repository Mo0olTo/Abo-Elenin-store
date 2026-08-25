import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { StoreLayout } from './store-layout';

describe('StoreLayout', () => {
  let component: StoreLayout;
  let fixture: ComponentFixture<StoreLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreLayout],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        providePrimeNG({ theme: { preset: Aura } }),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
