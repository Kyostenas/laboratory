import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPublicoComponent } from './layout-publico.component';

describe('LayoutPublicoComponent', () => {
    let component: LayoutPublicoComponent;
    let fixture: ComponentFixture<LayoutPublicoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LayoutPublicoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LayoutPublicoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
