import { TestBed } from '@angular/core/testing';

import { StandardRoutingService } from './standard-routing.service';

describe('StandardRoutingService', () => {
    let service: StandardRoutingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StandardRoutingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
