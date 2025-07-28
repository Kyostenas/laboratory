import { Injector, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipe_dinamico'
})
export class PipeDinamicoPipe implements PipeTransform {

  public constructor(private injector: Injector) {}

  transform(valor_pipe: any, pipe_token?: any, pipe_args?: any[]): any {
    if (!pipe_token) {
      return valor_pipe
    } else {
      if (!!pipe_token) {
        try {
          return pipe_token.prototype.transform(valor_pipe, ...(pipe_args ?? []))
        } catch {
          return pipe_token.prototype.transform(valor_pipe)
        }
      } else {
        return valor_pipe
      }
    }
  }

}
