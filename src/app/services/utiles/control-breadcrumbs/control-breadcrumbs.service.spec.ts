import { TestBed } from '@angular/core/testing';

import { ControlBreadcrumbsService } from './control-breadcrumbs.service';

describe('ControlBreadcrumbsService', () => {
  let service: ControlBreadcrumbsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlBreadcrumbsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
