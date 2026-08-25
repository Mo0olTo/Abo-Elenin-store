import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

import { Checkout } from './checkout';

describe('Checkout', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        MessageService,
        {
          provide: Firestore,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
