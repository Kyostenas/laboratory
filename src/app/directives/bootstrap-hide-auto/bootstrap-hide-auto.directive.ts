import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[bs-hide-auto]',
  standalone: true
})
export class BootstrapHideAutoDirective implements OnInit {

  constructor(
      private elementRef: ElementRef,
      private renderer2: Renderer2,
  ) { }

  /**
   * Milisegundos para ocultar el elemento. Por defecto son `1000 ms`.
   */
  @Input('bs-hide-auto') ms_para_ocultar?: number = 1000
  @Input('no-ocultar-automatico') no_ocultar?: boolean = false
  @Input('ocultar-manual') set ocultar_manual(value: boolean) {
    if (value) {
      this.ocultar(true)
    } else {
      this.renderer2.removeStyle(
        this.elementRef.nativeElement,
        'display'
      )
    }
  }
  @Input('no-eliminar') no_eliminar?: boolean = false

  ngOnInit(): void {
    this.ocultar(false)
  }

  ocultar(manual: boolean = false) {
    if (!this.no_ocultar || manual) {
      setTimeout(() => {
        const ELEMENTO = this.elementRef.nativeElement
        this.renderer2.addClass(ELEMENTO, 'showing')
        setTimeout(() => {
          this.renderer2.addClass(ELEMENTO, 'hide')
          setTimeout(() => {
            this.renderer2.removeClass(ELEMENTO, 'showing')
            this.renderer2.removeClass(ELEMENTO, 'show')

          }, 50)
          setTimeout(() => {
            if (!this.no_eliminar) {
              const BODY = this.elementRef.nativeElement.querySelector('body')
              this.renderer2.removeChild(BODY, ELEMENTO)
            } else {
              this.renderer2.setStyle(ELEMENTO, 'display', 'none')
            }
          }, 100)
        }, 50)
      }, this.ms_para_ocultar)
    }
  }

}
