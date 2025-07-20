import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleReserve } from './modal-detalle-reserve';

describe('ModalDetalleReserve', () => {
  let component: ModalDetalleReserve;
  let fixture: ComponentFixture<ModalDetalleReserve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalleReserve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleReserve);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
