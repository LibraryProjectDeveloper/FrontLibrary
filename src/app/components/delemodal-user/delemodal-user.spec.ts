import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelemodalUser } from './delemodal-user';

describe('DelemodalUser', () => {
  let component: DelemodalUser;
  let fixture: ComponentFixture<DelemodalUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelemodalUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelemodalUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
