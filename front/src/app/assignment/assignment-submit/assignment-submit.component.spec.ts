import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSubmitComponent } from './assignment-submit.component';

describe('AssignmentSubmitComponent', () => {
  let component: AssignmentSubmitComponent;
  let fixture: ComponentFixture<AssignmentSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentSubmitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
