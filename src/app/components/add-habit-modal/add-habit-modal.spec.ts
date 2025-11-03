import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHabitModal } from './add-habit-modal';

describe('AddHabitModal', () => {
  let component: AddHabitModal;
  let fixture: ComponentFixture<AddHabitModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHabitModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHabitModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
