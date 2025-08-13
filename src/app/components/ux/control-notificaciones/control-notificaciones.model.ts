import { TemplateRef } from '@angular/core';
import { POSICIONES_BS, COLORES_BS_FONDO, COLORES_BS_TEXTO, COLROES_BS_BORDES, COLORES_BS_ALERT } from '../../../services/utiles/utilidades/utilidades.service';


export interface EspecificacionServicioNotificacion {
    toast: EspecificacionNotificacion[];
    alert: EspecificacionNotificacion[];
    modal: EspecificacionNotificacion[];
}

export interface EspecificacionNotificacion {
    /**
     * No es necesario definirlo. De todas formas se define
     * automaticamente.
     */
    id?: string;
    /**
     * No es necesario definirlo. De todas formas se define
     * automaticamente.
     */
    // clase?: 'show' | 'showing' | 'hide'
    tipo: 'toast' | 'alert' | 'modal';
    duracion_en_ms?: number;
    cuerpo_mensaje: String;
    posicion?: POSICIONES_BS;
    modo?:
        | 'warning'
        | 'danger'
        | 'success'
        | 'info'
        | 'question'
        | 'notice'
        | 'neutro';
    // ancho: string
    color_fondo?: COLORES_BS_FONDO;
    color_texto?: COLORES_BS_TEXTO;
    color_borde?: COLROES_BS_BORDES;
    color_alert?: COLORES_BS_ALERT;
    simbolo?: string;
    titulo?: string;
    cuerpo_template?: TemplateRef<any>;
}
