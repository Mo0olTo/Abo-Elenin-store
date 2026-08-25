import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingStyles } from './trending-styles';

describe('TrendingStyles', () => {
  let component: TrendingStyles;
  let fixture: ComponentFixture<TrendingStyles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingStyles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingStyles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
