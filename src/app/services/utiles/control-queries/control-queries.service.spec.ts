import { TestBed } from '@angular/core/testing';

import { ControlQueriesService } from './control-queries.service';

describe('ControlQueriesService', () => {
    let service: ControlQueriesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ControlQueriesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
