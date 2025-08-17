import { Component, signal, TemplateRef, WritableSignal } from '@angular/core';
import { HeaderService } from '../../../../services/utiles/header/header.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GenericFloatingContainerDirective } from '../../../../directives/generic-floating-container/generic-floating-container.directive';
import { FloatingContainerData } from '../../../../directives/generic-floating-container/generic-floating-container.model';

@Component({
    selector: 'csys-layout-publico',
    imports: [RouterOutlet, CommonModule, GenericFloatingContainerDirective],
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

    // (o==================================================================o)
    //   #region DRAGGABLE BUTTON
    // (o-----------------------------------------------------------\/-----o)

    buttonTop = 0; // Initial top position in pixels
    buttonLeft = 0; // Initial left position in pixels
    private offsetX = 0;
    private offsetY = 0;

    onDragStart(event: DragEvent): void {
        if (event.target instanceof HTMLElement) {
            const rect = event.target.getBoundingClientRect();
            this.offsetX = event.clientX - rect.left;
            this.offsetY = event.clientY - rect.top;
            event.dataTransfer?.setData('text/plain', ''); // Required for drag to work
        }
    }

    onDragEnd(event: DragEvent): void {
        this.buttonTop = event.clientY - this.offsetY;
        this.buttonLeft = event.clientX - this.offsetX;
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion DRAGGABLE BUTTON
    // (o==================================================================o)

    content = 'Initial content from AppComponent';

    updateContent() {
        this.content = `AppComponent updated at ${new Date().toLocaleTimeString()}`;
        console.log(this.content);
    }

    // (o==================================================================o)
    //   #region FLOATING ELEMENTS
    // (o-----------------------------------------------------------\/-----o)

    floating_data: FloatingContainerData = {
        body_content: 'hola',
    };

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion FLOATING ELEMENTS
    // (o==================================================================o)
}
