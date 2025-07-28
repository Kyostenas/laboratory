import { Injectable, signal, TemplateRef, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  
  private componente: WritableSignal<TemplateRef<any> | undefined> = signal(undefined)

  set_componente(componente: TemplateRef<any>) {
    this.componente.update((value) => componente)
  }

  get_componente() {
    return this.componente
  }
  
}
