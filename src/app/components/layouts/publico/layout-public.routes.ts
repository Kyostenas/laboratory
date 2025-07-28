import { Routes } from "@angular/router";

export const routes: Routes = [
    { 
        path: '',
        loadComponent: () => import('./layout-publico/layout-publico.component')
            .then(x => x.LayoutPublicoComponent), 
        providers: [],
        children: [
            // {
            //     path: 'cotizaciones',
            //     loadComponent: () => import('../../folios-botones/PUBLICO-vista-folio-detalle/PUBLICO-vista-folio-detalle.component')
            //         .then(x => x.VistaFolioDetalleComponent)
        
            // },
        ]
    },
]