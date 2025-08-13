import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Tooltip } from 'bootstrap';

@Directive({
  selector: '[bs-tooltip]'
})
export class BootstrapTooltipDirective implements OnInit, OnDestroy {
  
  // (o==================================================================o)
  //   #region INICIALIZACION (INICIO)
  // (o-----------------------------------------------------------\/-----o)
  
  constructor(
    private el: ElementRef,
    // private renderer: Renderer2,
    // private cdr: ChangeDetectorRef,
    // private utiles: UtilidadesService,
  ) { }

  ngOnInit(): void {
    this.construir_tooltip()
  }

  ngOnDestroy(): void {
    if (this.id_enfocar_destroy) {
      document.getElementById(this.id_enfocar_destroy)?.focus()
    }
    this.destruir_tooltip() 
  }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion INICIALIZACION (FIN)
  // (o==================================================================o)
  
  // (o==================================================================o)
  //   #region INPUTS, OUTPUTS Y VARIABLES (INICIO)
  // (o-----------------------------------------------------------\/-----o)
  
  contenido?: string
  @Input('bs-tooltip') set _contenido(value: string) {
    this.contenido = value
    if (this.tooltip) {
      this.construir_tooltip()
    }
  }
  @Input('plantilla') plantilla!: TemplateRef<any>
  @Input('clase_tooltip') clase: 'tooltip-primary'
    | 'tooltip-secondary'
    | 'tooltip-success'
    | 'tooltip-info'
    | 'tooltip-warning'
    | 'tooltip-danger'
    | 'tooltip-light'
    | 'tooltip-dark'
    | 'tooltip-black'
    | 'tooltip-white' = 'tooltip-black'
  @Input('posicion_tooltip') posicion: 'top' 
    | 'left' 
    | 'right' 
    | 'bottom' = 'bottom'
  @Input('ocultar_con_click') ocultar_con_click: boolean = false
  @Input('id_elemento_a_enfocar_cuando_padre_destruido') id_enfocar_destroy!: string

  private elemento_padre!: HTMLElement
  private tooltip?: Tooltip
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion INPUTS, OUTPUTS Y VARIABLES (FIN)
  // (o==================================================================o)
  
  // (o==================================================================o)
  //   #region PROCESAMIENTO DEL TOOLTIP (INICIO)
  // (o-----------------------------------------------------------\/-----o)
  
  construir_tooltip() {
    if (!this.contenido || this.contenido?.length === 0) return
    if (!this.elemento_padre) {
      this.elemento_padre = this.el.nativeElement
    }
    this.elemento_padre.setAttribute('data-bs-toggle', 'tooltip')
    this.elemento_padre.setAttribute('data-bs-placement', this.posicion)
    this.elemento_padre.setAttribute('data-bs-custom-class', this.clase)
    this.elemento_padre.setAttribute('data-bs-title', this.contenido)
    this.elemento_padre.setAttribute('data-bs-html', 'true')
    this.tooltip = new Tooltip(this.elemento_padre)
  }

  destruir_tooltip() {
    this.tooltip?.dispose()
    delete this.tooltip
  }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion PROCESAMIENTO DEL TOOLTIP (FIN)
  // (o==================================================================o)

  // (o==================================================================o)
  //   #region EVENTOS (INICIO)
  // (o-----------------------------------------------------------\/-----o)
  
  @HostListener('click')
  on_click() {
    if (this.ocultar_con_click) {
      this.destruir_tooltip()
    }
  }

  @HostListener('mouseenter')
  on_mouse_enter() {
    if (this.ocultar_con_click) {
      if (!this.tooltip) {
        this.construir_tooltip()
      }
    }
  }

  // @HostListener('mouseleave')
  // on_mouse_leave() {
  //   if (this.ocultar_con_click) {
  //     this.destruir_tooltip()
  //   }
  // }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion EVENTOS (FIN)
  // (o==================================================================o)
  
}
