import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrestamo } from './modal-prestamo';

describe('ModalPrestamo', () => {
  let component: ModalPrestamo;
  let fixture: ComponentFixture<ModalPrestamo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPrestamo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPrestamo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
