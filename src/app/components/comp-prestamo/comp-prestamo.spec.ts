import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompPrestamo } from './comp-prestamo';

describe('CompPrestamo', () => {
  let component: CompPrestamo;
  let fixture: ComponentFixture<CompPrestamo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompPrestamo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompPrestamo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
