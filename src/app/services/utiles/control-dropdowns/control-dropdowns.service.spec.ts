import { TestBed } from '@angular/core/testing';

import { ControlDropdownsService } from './control-dropdowns.service';

describe('ControlDropdownsService', () => {
  let service: ControlDropdownsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlDropdownsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
