import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReportBook } from './modal-report-book';

describe('ModalReportBook', () => {
  let component: ModalReportBook;
  let fixture: ComponentFixture<ModalReportBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalReportBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalReportBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
