import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterGender } from './filter-gender';

describe('FilterGender', () => {
  let component: FilterGender;
  let fixture: ComponentFixture<FilterGender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterGender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterGender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
