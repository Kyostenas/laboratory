import { Injectable, signal, WritableSignal } from '@angular/core';
import { UtilidadesService } from '../utilidades/utilidades.service';

@Injectable({
    providedIn: 'root',
})
export class DeteccionViewportService {
    // (o==================================================================o)
    //   #region INICIALIZACION (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    constructor(private utiles: UtilidadesService) {}

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion INICIALIZACION (FIN)
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region VARIABLES (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    /**
     * Indica el ancho minimo del viewport para
     * pasar a modo movil
     */
    inner_width_minimo_movil: number = 999;

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion VARIABLES (FIN)
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region SIGNALES (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    modo_viewport: WritableSignal<'movil' | 'escritorio'> = signal('movil');
    modo_tabla_generica: WritableSignal<'tabla' | 'columnas'> =
        signal('columnas');

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion SIGNALES (FIN)
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region FUNCIONES PARA EVENTOS (inicio)
    // (o-----------------------------------------------------------\/-----o)

    calcular_ancho_viewport() {
        if (window.innerWidth < this.inner_width_minimo_movil) {
            this.modo_viewport.update(() => 'movil');
            this.modo_tabla_generica.update(() => 'columnas');
        } else {
            this.modo_viewport.update(() => 'escritorio');
            this.modo_tabla_generica.update(() => 'tabla');
        }
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion FUNCIONES PARA EVENTOS (fin)
    // (o==================================================================o)
}
