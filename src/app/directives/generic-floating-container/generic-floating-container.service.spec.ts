import { TestBed } from '@angular/core/testing';

import { GenericFloatingContainerService } from './generic-floating-container.service';

describe('GenericFloatingContainerService', () => {
  let service: GenericFloatingContainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericFloatingContainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
