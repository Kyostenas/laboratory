import { TestBed } from '@angular/core/testing';

import { DeteccionViewportService } from './deteccion-viewport.service';

describe('DeteccionViewportService', () => {
    let service: DeteccionViewportService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DeteccionViewportService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
