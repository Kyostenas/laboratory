import { Routes } from '@angular/router';
import { PaginaNoEncontradaComponent } from './components/ux/pagina-no-encontrada/pagina-no-encontrada.component';

export const routes: Routes = [
    { 
        path: '', 
        pathMatch: 'full',
        redirectTo: 'publico'
    },
    {
        path: 'publico',
        loadChildren: () => import('./components/layouts/publico/layout-public.routes')
            .then(x => x.routes)

    },
    { path: '*', redirectTo: '' },
    { path: '**', component: PaginaNoEncontradaComponent },
];
