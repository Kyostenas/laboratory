import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[bs-show-auto]',
  standalone: true
})
export class BootstrapShowAutoDirective implements OnInit {

  constructor(
    private elementRef: ElementRef,
    private renderer2: Renderer2,
  ) { }

  @Input('mostrar-manual') set mostrar_manual(value: boolean) {
    if(value) {
      this.mostrar()
    }
  }

  ngOnInit(): void {
    this.mostrar()
  }

  mostrar() {
    setTimeout(() => {
      const ELEMENTO = this.elementRef.nativeElement
      this.renderer2.addClass(ELEMENTO, 'hide')
      this.renderer2.addClass(ELEMENTO, 'fade')
      this.renderer2.addClass(ELEMENTO, 'showing')
      setTimeout(() => {
        this.renderer2.removeClass(ELEMENTO, 'hide')
        this.renderer2.addClass(ELEMENTO, 'show')
        setTimeout(() => {
          this.renderer2.removeClass(ELEMENTO, 'showing')
        }, 50)
      }, 50)
    }, 0)
  }

}
