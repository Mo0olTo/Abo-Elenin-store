import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPrice } from './filter-price';

describe('FilterPrice', () => {
  let component: FilterPrice;
  let fixture: ComponentFixture<FilterPrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterPrice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterPrice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
