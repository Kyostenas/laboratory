import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControlDropdownsService {

  private dropdowns_activos: Set<HTMLElement> = new Set()
  private _ultimo_dropdown_registrado?: HTMLElement

  constructor() { }

  get ultimo_dropdown_registrado(): HTMLElement | undefined {
    return this._ultimo_dropdown_registrado
  }
  

  registrar_dropdown(dropdown: HTMLElement) {
    this._ultimo_dropdown_registrado = dropdown
    this.dropdowns_activos.add(dropdown)
  }

  eliminar_dropdown(flotante: HTMLElement) {
    this.dropdowns_activos.delete(flotante)
    if (flotante === this._ultimo_dropdown_registrado) {
      delete this._ultimo_dropdown_registrado
    }
  }

  elemento_esta_dentro_de_dropdown(elemento: Node): boolean {
    const DENTRO_DROPDOWN = Array.from(this.dropdowns_activos).some(un_dropdown => {
      return un_dropdown.contains(elemento)
    })
    return DENTRO_DROPDOWN
  }
  
}
