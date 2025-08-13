import { ChangeDetectorRef, Directive, ElementRef, EmbeddedViewRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, TemplateRef } from '@angular/core';
import { ControlDropdownsService } from '../../services/utiles/control-dropdowns/control-dropdowns.service';
import { UtilidadesService } from '../../services/utiles/utilidades/utilidades.service';

@Directive({
  selector: '[bs-dropdown]',
  standalone: true
})
export class BootstrapDropdownDirective implements OnInit, OnDestroy {

  // (o==================================================================o)
  //   #region INICIALIZACION (INICIO)
  // (o-----------------------------------------------------------\/-----o)
  
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control_dropdowns: ControlDropdownsService,
    private cdr: ChangeDetectorRef,
    private utiles: UtilidadesService,
  ) { }

  ngOnInit(): void {
    // this.construir_dropdown()
    this.elemento_padre = this.el.nativeElement
  }

  ngOnDestroy(): void {
    // if (this.id_enfoque_padre_destruido) {
    //   document
    //   .getElementById(this.id_enfoque_padre_destruido)
    //   ?.focus()
    // }
    this.posicionado_por_salir_de_pantalla = false
    this.no_eliminar = false
    this.ocultar()
    try {
      this.resize_observer?.disconnect()
      delete this.resize_observer
    } catch {

    }
  }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion INICIALIZACION (FIN)
  // (o==================================================================o)
  
  // (o==================================================================o)
  //   #region INPUTS, OUTPUTS Y VARIABLES (INICIO)
  // (o-----------------------------------------------------------\/-----o)
  
  @Input('bs-dropdown') contenido_dropdown!: string
  @Input('plantilla') plantilla_dropdown!: TemplateRef<any>
  @Input('contexto_plantilla') contexto_plantilla = {}
  @Input('mostrar_dropdown_con_click') mostrar_con_click: boolean = false
  @Input('no_eliminar') no_eliminar: boolean = false
  @Input('padding') padding: number = 5
  @Input('posicion_dropdown') posicion: 'up' | 'start' | 'end' | 'down' = 'down'
  @Input('definir_scroll_maximo_automatico') definir_scroll_maximo_automatico = false
  @Input('ocultar_dropdown_con_click_interno') ocultar_con_click = false
  @Input('clases_dropdown') clases_dropdown!: string
  @Input('solo_ocultar_con_boton') solo_ocultar_con_boton: boolean = false
  @Input('id_elemento_a_enfocar_cuando_padre_destruido') id_enfoque_padre_destruido!: string
  @Output('dropdown_destruido') emisor_dropdown_destruido: EventEmitter<void> = new EventEmitter()
  @Output('mostrando_dropdown') emisor_mostrando_dropdown: EventEmitter<boolean> = new EventEmitter()
  @Output('id_dropdown') emisor_id_dropdown: EventEmitter<string> = new EventEmitter()
  @Output('id_boton_cerrado') emisor_id_boton_cerrado: EventEmitter<string> = new EventEmitter()

  private elemento_padre!: HTMLElement
  private dropdown?: HTMLElement
  private vista_embebida!: EmbeddedViewRef<any>
  private se_esta_mostrando: boolean = false
  private top_dropdown = 0
  private left_dropdown = 0
  private posicionado_por_salir_de_pantalla = false
  private resize_observer?: ResizeObserver
  private id_dropdown?: string
  private id_boton_cerrado?: string
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion INPUTS, OUTPUTS Y VARIABLES (FIN)
  // (o==================================================================o)

  // (o==================================================================o)
  //   #region DETECTORES DE EVENTOS (INICIO)
  // (o-----------------------------------------------------------\/-----o)
  
  @HostListener('keydown.escape') 
  on_escape() {
    if (!this.solo_ocultar_con_boton) {
      this.ocultar()
    }
  }

  @HostListener('mouseenter') 
  on_mouse_enter() {
    if (!this.mostrar_con_click) {
      this.mostrar()
    }
  }

  @HostListener('focus')
  on_focus() {
    this.on_mouse_enter()
  }

  @HostListener('blur')
  on_blur() {
    this.on_mouse_leave()
  }
  
  @HostListener('mouseleave') 
  on_mouse_leave() {
    if (!this.mostrar_con_click && !this.solo_ocultar_con_boton) {
      this.ocultar()
    }
  }

  @HostListener('click', ['$event'])
  on_click(event: Event) {
    if (this.mostrar_con_click) {
      const TARGET = event.target as HTMLElement
      const ESTA_DENTRO_DROPDOWN = this.control_dropdowns
        .elemento_esta_dentro_de_dropdown(TARGET as Node)
      const ESTA_DENTRO_PADRE = this.elemento_padre.contains(event.target as Node)
      const ESTA_EN_ESTE_DROP_DOWN = this.dropdown?.contains(event.target as Node)
      if (!this.se_esta_mostrando) {
        this.mostrar()
      } else {
        if (
          (
            (
              !ESTA_DENTRO_DROPDOWN 
              && ESTA_DENTRO_PADRE
            ) 
            || !ESTA_EN_ESTE_DROP_DOWN
            || this.ocultar_con_click
          )
          && !this.solo_ocultar_con_boton
        ) {
          this.ocultar()
        }
      }
    }
  }

  @HostListener('keydown.enter', ['$event'])
  on_enter(event: Event) {
    this.on_click(event)
  }

  @HostListener('document:click', ['$event'])
  on_document_click(event: MouseEvent) {
    if (!this.dropdown) return
    const TARGET = event.target as HTMLElement
    const ESTA_DENTRO_DROPDOWN = this.control_dropdowns
      .elemento_esta_dentro_de_dropdown(TARGET as Node)
    const ESTA_DENTRO_PADRE = this.elemento_padre.contains(event.target as Node)
    const ESTA_DENTRO = ESTA_DENTRO_DROPDOWN || ESTA_DENTRO_PADRE
    const NIVEL_PARENTESCO =  this.utiles.obtener_nivel_de_descendencia_entre_nodos_html(
      <HTMLElement>this.dropdown, event.target as HTMLElement
    )
    if (TARGET.id !== this.id_dropdown && TARGET.id !== this.id_boton_cerrado) {
      if (
        this.solo_ocultar_con_boton 
        && !TARGET.classList.contains('dropdown-personalizado')
        && !TARGET.classList.contains('padre-dropdown')
      ) {
        return
      }
    } 
    else {
      if (TARGET.id === this.id_boton_cerrado) {
        if (this.solo_ocultar_con_boton) {
          this.ocultar()
          return
        }
      }
    }
    if (
      (
        this.se_esta_mostrando 
        && !ESTA_DENTRO 
        && this.mostrar_con_click 
      ) || (
        NIVEL_PARENTESCO < 0
        && !ESTA_DENTRO_PADRE
      )
    ) {
      this.ocultar()
    }
  }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion DETECTORES DE EVENTOS (FIN)
  // (o==================================================================o)
  
  // (o==================================================================o)
  //   #region PROCESAMIENTO DE DROPDOWN (INICIO)
  // (o-----------------------------------------------------------\/-----o)
  
  detectar_cambios() {
    try {
      this.cdr.detectChanges()
      this.vista_embebida.detectChanges()
    } catch {}
  }
  
  construir_dropdown() {
    if (!!this.dropdown) return
    if (!this.elemento_padre) {
      this.elemento_padre = this.el.nativeElement
    }
    this.renderer.addClass(this.elemento_padre, 'padre-dropdown')
    this.dropdown = this.renderer.createElement('ul')
    this.id_dropdown = this.utiles.crear_bsonobj_id_para_variable()
    this.id_boton_cerrado = this.utiles.crear_bsonobj_id_para_variable()
    this.renderer.setProperty(this.dropdown, 'id', this.id_dropdown)
    this.emisor_id_dropdown.emit(this.id_dropdown)
    
    this.resize_observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setTimeout(() => {
          if (this.se_esta_mostrando) {
            this.posicionar_dropdown(true)
            this.relocalizar_por_salir_de_pantalla()
            this.detectar_cambios()
          }
        })
      }
    })

    this.resize_observer.observe(<HTMLElement>this.dropdown)
    
    this.renderer.addClass(this.dropdown, 'dropdown-menu')
    this.renderer.addClass(this.dropdown, 'dropdown-personalizado')
    this.renderer.setStyle(this.dropdown, 'max-width', '15vw')
    this.renderer.setStyle(this.dropdown, 'word-wrap', 'normal')
    this.renderer.setStyle(this.dropdown, 'overflow', 'visible')
    this.renderer.setStyle(this.dropdown, 'word-break', 'normal')
    this.renderer.setStyle(this.dropdown, 'text-wrap', 'wrap')
    this.renderer.addClass(this.dropdown, 'shadow')
    this.renderer.addClass(this.dropdown, 'border-hover-secondary')
    this.renderer.addClass(this.dropdown, 'shadow-hover-lg')
    this.renderer.addClass(this.dropdown, 'scale-hover-md')
    this.renderer.setProperty(this.dropdown, 'tabindex', 1)
    // this.renderer.addClass(this.dropdown, 'text-center')
    this.renderer.setStyle(this.dropdown, 'padding', `${this.padding}px`)

    if (this.contenido_dropdown) {
      this.renderer.setProperty(
        this.dropdown, 
        'innerHTML', 
        `
          ${this.contenido_dropdown}
        `
      )
    } else if (this.plantilla_dropdown) {
      this.vista_embebida = this.plantilla_dropdown
        .createEmbeddedView(this.contexto_plantilla)
      this.vista_embebida.rootNodes.forEach(node => {
        this.renderer.appendChild(this.dropdown, node)
        // node.detectChanges()
        this.detectar_cambios()
      })
    } else {
      this.renderer.setProperty(
        this.dropdown, 
        'innerHTML', 
        '<li><a class="dropdown-item rounded border-hover border-hover-primary"><i class="bi bi-ban"></i></a></li>'
      )
    }
    if (this.mostrar_con_click && this.solo_ocultar_con_boton) {
      const BOTON_CERRADO = this.renderer.createElement('li')
      const HR_BOTON_CERRADO = this.renderer.createElement('hr')
      this.renderer.addClass(HR_BOTON_CERRADO, 'hr-completo')
      this.renderer.setProperty(
        BOTON_CERRADO,
        'innerHTML',
        `
            <a class="
              dropdown-item 
              rounded
              bg-hover bg-hover-danger 
            " tabindex="0" id="${this.id_boton_cerrado}">
              <span class="h6">
                <i class="bi bi-x-lg"></i>
                CERRAR
              </span>
            </a>
        `
      )
      this.renderer.appendChild(this.dropdown, HR_BOTON_CERRADO)
      this.renderer.appendChild(this.dropdown, BOTON_CERRADO)
    }
    this.aplicar_estilos_personalizados()
    if (this.clases_dropdown) {
      for (let clase of this.clases_dropdown.split(' ')) {
        this.renderer.addClass(this.dropdown, clase)
      }
    }
    this.control_dropdowns.registrar_dropdown(<HTMLElement>this.dropdown)
    this.renderer.appendChild(this.elemento_padre, this.dropdown)
  }

  destruir_dropdown() {
    if (!this.dropdown) return
    this.renderer.removeChild(this.elemento_padre, this.dropdown)
    this.control_dropdowns.eliminar_dropdown(<HTMLElement>this.dropdown)
    delete this.dropdown
    this.emisor_dropdown_destruido.emit()
    try {
      this.resize_observer?.disconnect()
    } catch {

    }
  }

  mostrar() {
    if (!!this.dropdown) return
    this.se_esta_mostrando = true
    if (!this.dropdown) {
      this.construir_dropdown()
    }
    this.posicionar_dropdown()
    this.detectar_cambios()
    setTimeout(() => {
      this.renderer.setStyle(this.dropdown, 'display', 'block');
      this.renderer.addClass(this.dropdown, 'show');
      setTimeout(() => {
        this.relocalizar_por_salir_de_pantalla()
      }, 0)
    }, 0)
    this.emitir_mostrando()
  }

  ocultar() {
    if (!this.dropdown) return
    // if (this.utiles.obtener_indice_actual_enfoque_tab().indice_actual !== -1) {
    //   this.elemento_padre.focus()
    // }
    this.se_esta_mostrando = false
    this.renderer.removeClass(this.dropdown, 'show');
    if (!this.no_eliminar) {
      setTimeout(() => {
        this.destruir_dropdown()
      }, 0)
    }
    this.emitir_mostrando()
  }

  emitir_mostrando() {
    this.emisor_mostrando_dropdown.emit(this.se_esta_mostrando)
  }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion PROCESAMIENTO DE DROPDOWN (FIN)
  // (o==================================================================o)
  
  // (o==================================================================o)
  //   #region ESTILOS PERSONALIZADOS INTERNOS (INICIO)
  // (o-----------------------------------------------------------\/-----o)
  
  private encontrar_todos_los_elementos_shadow_root(elemento: HTMLElement, query: string) {
    const elementos: HTMLElement[] = Array.from(elemento.querySelectorAll(query))
    elemento.childNodes.forEach((child: any) => {
      if (child.shadowRoot) {
        elementos.push(...this.encontrar_todos_los_elementos_shadow_root(
          child.shadowRoot,
          query)
        )
      }
    })
    return elementos
  }

  private encontrar_todos_los_elementos_solo_query_selector(elemento: HTMLElement, query: string) {
    const elementos = Array.from(
      (<HTMLElement>this.dropdown)
        .querySelectorAll(query)
    )
    return elementos
  }

  private obtener_hijos(elemento: HTMLElement, query: string) {
    return [
      ...this.encontrar_todos_los_elementos_shadow_root(elemento, query),
      ...this.encontrar_todos_los_elementos_solo_query_selector(elemento, query),
    ]
  }
  
  private aplicar_estilos_personalizados() {
    const elementosHR = this.obtener_hijos(<HTMLElement>this.dropdown, 'hr.hr-completo')
    const elementosCompletos = this.obtener_hijos(<HTMLElement>this.dropdown, '.recuadro-completo')
    const paddingUsado = this.padding
    let iElemenCompleto = 0
    elementosCompletos.forEach(elemCompleto => {
      if (iElemenCompleto === 0) {
        this.renderer.setStyle(elemCompleto, 'margin-top', `-${paddingUsado}px`)
      }
      if ((iElemenCompleto - 1) === elementosCompletos.length) {
        this.renderer.setStyle(elemCompleto, 'margin-bottom', `-${paddingUsado}px`)
      }
      this.renderer.setStyle(elemCompleto, 'width', `calc(100% + ${2 * paddingUsado}px)`)
      this.renderer.setStyle(elemCompleto, 'margin-left', `-${paddingUsado}px`)
      this.renderer.setStyle(elemCompleto, 'margin-right', `-${paddingUsado}px`)
      this.renderer.setStyle(elemCompleto, 'margin-top', `0px`)
      this.renderer.setStyle(elemCompleto, 'margin-bottom', `0px`)
      iElemenCompleto++
    })
    elementosHR.forEach(elementoHR => {
      this.renderer.setStyle(elementoHR, 'width', `calc(100% + ${2 * paddingUsado}px)`)
      this.renderer.setStyle(elementoHR, 'margin-left', `-${paddingUsado}px`)
      this.renderer.setStyle(elementoHR, 'margin-right', `-${paddingUsado}px`)
      this.renderer.setStyle(elementoHR, 'border-color', 'white')
      this.renderer.setStyle(elementoHR, 'background-color', 'white')
      this.renderer.setStyle(elementoHR, 'border-width', '1px')
      this.renderer.setStyle(elementoHR, 'box-sizing', 'border-box')
      this.renderer.setStyle(elementoHR, 'margin-top', '5px')
      this.renderer.setStyle(elementoHR, 'margin-bottom', '5px')
    })
  }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion ESTILOS PERSONALIZADOS INTERNOS (FIN)
  // (o==================================================================o)
  
  private posicionar_dropdown(noOcultar: boolean = false) {
    let posicionAValorar = this.posicion
    const posicionHost = this.elemento_padre.getBoundingClientRect()
    const alturaHost = this.el.nativeElement.innerHeight
    const scrollYAxis = window.scrollY || document.documentElement.scrollTop
    const scrollXAxis = window.scrollX || document.documentElement.scrollLeft
    const viewPortHeight = window.innerHeight
    const espacioInferiorMinimo = 10
    const alturaMaximaScroll = `${viewPortHeight - this.top_dropdown - espacioInferiorMinimo}`
    if (!noOcultar) {
      this.renderer.setStyle(this.dropdown, 'visibility', 'hidden')
      this.renderer.setStyle(this.dropdown, 'display', 'block')
    }
    const alturaFLotante = this.dropdown?.offsetHeight ?? 0
    const anchoFlotante = this.dropdown?.offsetWidth ?? 0
    if (!noOcultar) {
      this.renderer.setStyle(this.dropdown, 'display', 'none')
      this.renderer.removeStyle(this.dropdown, 'visibility')
    }
    
    if (!this.posicionado_por_salir_de_pantalla) {
      switch (posicionAValorar) {
        case 'up':
          this.top_dropdown = posicionHost.top + scrollYAxis - alturaFLotante
          this.left_dropdown = posicionHost.left + scrollXAxis
          break;
        case 'down':
          this.top_dropdown = posicionHost.bottom
          this.left_dropdown = posicionHost.left
          break;
        case 'end':
          this.top_dropdown = posicionHost.top
          this.left_dropdown = posicionHost.right + scrollXAxis
          break;
        case 'start':
          this.top_dropdown = posicionHost.top
          this.left_dropdown = posicionHost.left - anchoFlotante
          break;
        default:
          this.top_dropdown = posicionHost.top + scrollYAxis - alturaFLotante
          this.left_dropdown = posicionHost.left + scrollXAxis
          break;
      }
    }
    if (!!this.dropdown) {
        try {
          this.renderer.setStyle(this.dropdown, 'top', `${this.top_dropdown}px`)
          this.renderer.setStyle(this.dropdown, 'left', `${this.left_dropdown}px`)
          if (this.definir_scroll_maximo_automatico) {
            this.renderer.setStyle(this.dropdown, 'max-height', `${alturaMaximaScroll}px`)
            this.renderer.removeStyle(this.dropdown, 'overflow')
            this.renderer.setStyle(this.dropdown, 'overflow-y', `auto`)
            this.renderer.setStyle(this.dropdown, 'overflow-x', `hidden`)
          }
        } catch (err) {
        }
    }
    this.detectar_cambios()
  }

  private relocalizar_por_salir_de_pantalla() {
    setTimeout(() => {
      try {

        const rectFlotante = (<HTMLElement>this.dropdown).getBoundingClientRect()
        const viewPortWidth = window.innerWidth
        const viewPortHeight = window.innerHeight
    
        let posicionAValorar = this.posicion
        let puntoOverflow!: 'up' | 'start' | 'end' | 'down'
        if (rectFlotante.right > viewPortWidth) {
          puntoOverflow = 'end'
          this.left_dropdown -= (rectFlotante.right - viewPortWidth ) - 1
          this.posicionado_por_salir_de_pantalla = true
        }
        if (rectFlotante.bottom > viewPortHeight) {
          puntoOverflow = 'down'
          this.top_dropdown -= rectFlotante.bottom - viewPortHeight
          this.posicionado_por_salir_de_pantalla = true
        }
        if (rectFlotante.left < 0) {
          puntoOverflow = 'start'
          this.left_dropdown -= rectFlotante.left
          this.posicionado_por_salir_de_pantalla = true
        }
        if (rectFlotante.top < 0) {
          puntoOverflow = 'up'
          this.top_dropdown -= rectFlotante.top
          this.posicionado_por_salir_de_pantalla = true
        }
      
        switch (posicionAValorar) {
          case 'up':
            if (puntoOverflow === 'up') {
              this.posicion = 'down'
              this.posicionar_dropdown()
            } else {
              this.renderer.setStyle(this.dropdown, 'top', `${this.top_dropdown}px`);
              this.renderer.setStyle(this.dropdown, 'left', `${this.left_dropdown}px`);
            }
            break;
          case 'down':
            if (puntoOverflow === 'down') {
              this.posicion = 'up'
              this.posicionar_dropdown()
            } else {
              this.renderer.setStyle(this.dropdown, 'top', `${this.top_dropdown}px`);
              this.renderer.setStyle(this.dropdown, 'left', `${this.left_dropdown}px`);
            }
            break;
          case 'end':
            this.renderer.setStyle(this.dropdown, 'top', `${this.top_dropdown}px`);
            this.renderer.setStyle(this.dropdown, 'left', `${this.left_dropdown}px`);
            break;
          case 'start':
            this.renderer.setStyle(this.dropdown, 'top', `${this.top_dropdown}px`);
            this.renderer.setStyle(this.dropdown, 'left', `${this.left_dropdown}px`);
            break;
          default:
            this.renderer.setStyle(this.dropdown, 'top', `${this.top_dropdown}px`);
            this.renderer.setStyle(this.dropdown, 'left', `${this.left_dropdown}px`);
            break;
        }
      } catch (err) {
        // console.debug(`No se pudo reposicionar un flotante: ${err}`)
      }
    })
  }


}


