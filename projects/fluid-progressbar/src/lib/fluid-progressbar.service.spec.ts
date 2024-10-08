import { TestBed } from '@angular/core/testing';

import { FluidProgressbarService } from './fluid-progressbar.service';

describe('FluidProgressbarService', () => {
  let service: FluidProgressbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FluidProgressbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
