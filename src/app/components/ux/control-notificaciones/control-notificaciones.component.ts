import { Component, effect, signal, WritableSignal } from '@angular/core';
import { BootstrapHideAutoDirective } from '../../../directives/bootstrap-hide-auto/bootstrap-hide-auto.directive';
import { BootstrapShowAutoDirective } from '../../../directives/bootstrap-show-auto/bootstrap-show-auto.directive';
import { EspecificacionServicioNotificacion } from './control-notificaciones.model';
import { ControlNotificacionesService } from './control-notificaciones.service';

@Component({
    selector: 'app-control-notificaciones',
    imports: [
        BootstrapShowAutoDirective,
        BootstrapHideAutoDirective,
    ],
    templateUrl: './control-notificaciones.component.html',
    styleUrl: './control-notificaciones.component.scss'
})
export class ControlNotificacionesComponent{

  constructor(
    public controlNotifs: ControlNotificacionesService,
  ) {
    effect((onCleanup) => {
      const ESTADO_NOTIFS = this.controlNotifs.estado_notifiaciones()
      this.notificaciones.update(() => ESTADO_NOTIFS)
      onCleanup(() => {

      })
    })
  }

  notificaciones: WritableSignal<EspecificacionServicioNotificacion> = signal({
    alert: [],
    modal: [],
    toast: [],
  })

}
