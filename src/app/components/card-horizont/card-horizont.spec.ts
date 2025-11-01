import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHorizont } from './card-horizont';

describe('CardHorizont', () => {
  let component: CardHorizont;
  let fixture: ComponentFixture<CardHorizont>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHorizont]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardHorizont);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
