import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaModalUser } from './deta-modal-user';

describe('DetaModalUser', () => {
  let component: DetaModalUser;
  let fixture: ComponentFixture<DetaModalUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetaModalUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetaModalUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
