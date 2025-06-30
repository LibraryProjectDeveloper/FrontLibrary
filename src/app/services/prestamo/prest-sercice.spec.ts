import { TestBed } from '@angular/core/testing';

import { PrestSercice } from './prest-sercice';

describe('PrestSercice', () => {
  let service: PrestSercice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrestSercice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
