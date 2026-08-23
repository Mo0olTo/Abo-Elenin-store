import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSectionTitle } from './home-section-title';

describe('HomeSectionTitle', () => {
  let component: HomeSectionTitle;
  let fixture: ComponentFixture<HomeSectionTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSectionTitle],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeSectionTitle);
    fixture.componentRef.setInput('title', 'New arrivals');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
