import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComModalUser } from './com-modal-user';

describe('ComModalUser', () => {
  let component: ComModalUser;
  let fixture: ComponentFixture<ComModalUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComModalUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComModalUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
