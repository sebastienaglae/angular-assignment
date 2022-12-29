import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentRateComponent } from './assignment-rate.component';

describe('AssignmentRateComponent', () => {
  let component: AssignmentRateComponent;
  let fixture: ComponentFixture<AssignmentRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
