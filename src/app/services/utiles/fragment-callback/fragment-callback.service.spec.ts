import { TestBed } from '@angular/core/testing';

import { FragmentCallbackService } from './fragment-callback.service';

describe('FramentCallbackService', () => {
  let service: FragmentCallbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FragmentCallbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
