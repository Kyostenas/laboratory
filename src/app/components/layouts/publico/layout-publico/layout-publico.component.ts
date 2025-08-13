import { Component, signal, TemplateRef, WritableSignal } from '@angular/core';
import { HeaderService } from '../../../../services/utiles/header/header.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'csys-layout-publico',
    imports: [RouterOutlet, CommonModule],
    templateUrl: './layout-publico.component.html',
    styleUrl: './layout-publico.component.scss',
    standalone: true,
})
export class LayoutPublicoComponent {
    constructor(public header_service: HeaderService) {
        this.titulo_componente = this.header_service.get_componente();
    }

    titulo_componente?: WritableSignal<TemplateRef<any> | undefined>;
    protected readonly titulo_string = signal('LABORATORY');
}
