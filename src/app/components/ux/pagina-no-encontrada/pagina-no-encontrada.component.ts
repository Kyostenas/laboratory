import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardRoutingService } from '../../../services/utiles/standard-routing/standard-routing.service';

@Component({
    selector: 'csys-pagina-no-encontrada',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagina-no-encontrada.component.html',
    styleUrls: ['./pagina-no-encontrada.component.scss'],
})
export class PaginaNoEncontradaComponent {
    constructor(private standard_routing_service: StandardRoutingService) {}

    go_back() {
        this.standard_routing_service.go_back();
    }
}
