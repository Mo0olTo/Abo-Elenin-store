import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBrand } from './filter-brand';

describe('FilterBrand', () => {
  let component: FilterBrand;
  let fixture: ComponentFixture<FilterBrand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBrand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterBrand);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
