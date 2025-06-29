import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompReserva } from './comp-reserva';

describe('CompReserva', () => {
  let component: CompReserva;
  let fixture: ComponentFixture<CompReserva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompReserva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompReserva);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
