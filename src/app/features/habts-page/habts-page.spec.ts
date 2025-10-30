import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabtsPage } from './habts-page';

describe('HabtsPage', () => {
  let component: HabtsPage;
  let fixture: ComponentFixture<HabtsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabtsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabtsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
