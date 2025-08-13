import { Injectable, signal, WritableSignal } from '@angular/core';
import {
    EspecificacionServicioNotificacion,
    EspecificacionNotificacion,
} from './control-notificaciones.model';
import { UtilidadesService } from '../../../services/utiles/utilidades/utilidades.service';

@Injectable({
    providedIn: 'root',
})
export class ControlNotificacionesService {
    // especificacion: EspecificacionNotificacion = {
    //   tipo: 'toast',
    //   // duracionEnMs: 5000,
    //   cuerpoMensaje: '¡Hola! Esta es una notificación...',
    //   posicion: 'top_right',
    //   ancho: '18vw'
    // }

    estado_notifiaciones: WritableSignal<EspecificacionServicioNotificacion> =
        signal({
            toast: [],
            alert: [],
            modal: [],
        });

    // estado_notificaciones$ = this._notificaciones_subject.asObservable()

    constructor(private utiles: UtilidadesService) {}

    private agregar_notif_a_arreglo(
        nueva_notif: EspecificacionNotificacion,
        tipo: 'alert' | 'toast' | 'modal',
    ) {
        this.estado_notifiaciones.update((value) => {
            const ESTADO_ACDTUALIZADO = {
                ...value,
                [tipo]: [...value[tipo], nueva_notif],
            };
            return ESTADO_ACDTUALIZADO;
        });
    }

    private eliminar_notif_de_arreglo(
        id_notificacion: string,
        tipo: 'alert' | 'toast' | 'modal',
    ) {
        // const ESTADO_ACTUAL = this.estado_notifiaciones.value
        this.estado_notifiaciones.update((value) => {
            const ARREGLO_ACTUALIZADO = value[tipo].filter(
                (notif: EspecificacionNotificacion) =>
                    notif.id !== id_notificacion,
            );
            const ESTADO_ACTUALIZADO = {
                ...value,
                [tipo]: ARREGLO_ACTUALIZADO,
            };
            return ESTADO_ACTUALIZADO;
        });
    }

    private modificar_notif_de_arreglo(
        tipo: 'alert' | 'toast' | 'modal',
        datos: EspecificacionNotificacion,
    ) {
        this.estado_notifiaciones.update(
            (value: EspecificacionServicioNotificacion) => {
                const ARREGLO_ACTUALIZADO = value[tipo].map(
                    (notif: EspecificacionNotificacion) =>
                        notif.id !== datos.id ? datos : notif,
                );
                const ESTADO_ACTUALIZADO = {
                    ...value,
                    [tipo]: ARREGLO_ACTUALIZADO,
                };
                return ESTADO_ACTUALIZADO;
            },
        );
    }

    private preparar_toast(datos: EspecificacionNotificacion) {
        if (!datos.posicion) datos.posicion = 'top_left';
        if (!datos.duracion_en_ms) datos.duracion_en_ms = 6000;
        if (!datos.modo) datos.modo = 'neutro';
        switch (datos.modo) {
            case 'danger':
                datos.color_texto = 'text-danger-emphasis';
                datos.simbolo = 'bi bi-x-circle';
                break;
            case 'question':
                datos.simbolo = 'bi bi-question-circle';
                break;
            case 'info':
                datos.color_texto = 'text-info-emphasis';
                datos.simbolo = 'bi bi-info-circle';
                break;
            case 'notice':
                datos.color_texto = 'text-primary-emphasis';
                datos.simbolo = 'bi bi-bell';
                break;
            case 'success':
                datos.color_texto = 'text-success-emphasis';
                datos.simbolo = 'bi bi-check-circle';
                break;
            case 'warning':
                datos.color_texto = 'text-warning-emphasis';
                datos.simbolo = 'bi bi-exclamation-circle';
                break;
        }
    }

    private preparar_alert(datos: EspecificacionNotificacion) {
        if (!datos.posicion) datos.posicion = 'top_left';
        if (!datos.duracion_en_ms) datos.duracion_en_ms = 6000;
        if (!datos.modo) datos.modo = 'neutro';
        switch (datos.modo) {
            case 'danger':
                datos.color_alert = 'alert-danger';
                datos.simbolo = 'bi bi-x-circle';
                break;
            case 'question':
                datos.color_alert = 'alert-dark';
                datos.simbolo = 'bi bi-question-circle';
                break;
            case 'info':
                datos.color_alert = 'alert-info';
                datos.simbolo = 'bi bi-info-circle';
                break;
            case 'notice':
                datos.color_alert = 'alert-primary';
                datos.simbolo = 'bi bi-bell';
                break;
            case 'success':
                datos.color_alert = 'alert-success';
                datos.simbolo = 'bi bi-check-circle';
                break;
            case 'warning':
                datos.color_alert = 'alert-warning';
                datos.simbolo = 'bi bi-exclamation-circle';
                break;
        }
    }

    crear_notificacion(datos: EspecificacionNotificacion) {
        const ID = this.utiles.crear_bsonobj_id_para_variable();
        datos.id = ID;

        switch (datos.tipo) {
            case 'toast':
                this.preparar_toast(datos);
                this.agregar_notif_a_arreglo(datos, 'toast');
                setTimeout(
                    () => {
                        this.eliminar_notif_de_arreglo(
                            <string>datos.id,
                            datos.tipo,
                        );
                    },
                    (datos.duracion_en_ms ?? 0) + 200,
                );
                break;
            case 'alert':
                this.preparar_alert(datos);
                this.agregar_notif_a_arreglo(datos, 'alert');
                break;
            case 'modal':
                if (!datos.duracion_en_ms) datos.duracion_en_ms = 20000;
                this.agregar_notif_a_arreglo(datos, 'modal');
                break;
        }

        setTimeout(() => {}, 0);
    }
}
