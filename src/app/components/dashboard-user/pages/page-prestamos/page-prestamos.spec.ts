import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePrestamos } from './page-prestamos';

describe('PagePrestamos', () => {
  let component: PagePrestamos;
  let fixture: ComponentFixture<PagePrestamos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePrestamos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePrestamos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
