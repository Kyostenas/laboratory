import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlNotificacionesComponent } from './control-notificaciones.component';

describe('ControlNotificacionesComponent', () => {
  let component: ControlNotificacionesComponent;
  let fixture: ComponentFixture<ControlNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlNotificacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
