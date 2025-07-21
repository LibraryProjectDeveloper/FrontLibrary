import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetModalBook } from './det-modal-book';

describe('DetModalBook', () => {
  let component: DetModalBook;
  let fixture: ComponentFixture<DetModalBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetModalBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetModalBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
