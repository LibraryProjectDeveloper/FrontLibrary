import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageReservas } from './page-reservas';

describe('PageReservas', () => {
  let component: PageReservas;
  let fixture: ComponentFixture<PageReservas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageReservas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageReservas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
