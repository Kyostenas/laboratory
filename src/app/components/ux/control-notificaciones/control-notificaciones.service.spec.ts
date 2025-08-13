import { TestBed } from '@angular/core/testing';

import { ControlNotificacionesService } from './control-notificaciones.service';

describe('ControlNotificacionesService', () => {
    let service: ControlNotificacionesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ControlNotificacionesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
