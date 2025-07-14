import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCatalago } from './page-catalago';

describe('PageCatalago', () => {
  let component: PageCatalago;
  let fixture: ComponentFixture<PageCatalago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageCatalago]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageCatalago);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
