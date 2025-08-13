import { computed, effect, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class ControlQueriesService {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.query_string = toSignal(this.route.queryParams, {
            initialValue: {},
        }) as Signal<QUERY_PARAMS_GENERAL | undefined>;
        effect(() => {
            this.query_actual = this.get_computed_value();
        });
    }

    private get_computed_value() {
        return computed(() => {
            try {
                let objeto_final: { [type: string]: any } = {};
                for (let [nombre, valor_string] of Object.entries(
                    this.query_string() as QUERY_PARAMS_GENERAL,
                )) {
                    try {
                        objeto_final[nombre] = JSON.parse(valor_string);
                    } catch {
                        objeto_final[nombre] = valor_string;
                    }
                }
                return objeto_final as QUERY_PARAMS_GENERAL;
            } catch (err) {
                return {} as QUERY_PARAMS_GENERAL;
            }
        });
    }

    private query_string!: Signal<QUERY_PARAMS_GENERAL | undefined>;
    query_actual: Signal<QUERY_PARAMS_GENERAL> = this.get_computed_value();

    /**
     * The collection of all the avialable queries
     */
    queries = {
        id: this.preparar_query<QUERY_PARAMS_GENERAL['id']>('id'),
        pagination:
            this.preparar_query<QUERY_PARAMS_GENERAL['pagination']>(
                'pagination',
            ),
        global_search:
            this.preparar_query<QUERY_PARAMS_GENERAL['global_search']>(
                'global_search',
            ),
        term_search:
            this.preparar_query<QUERY_PARAMS_GENERAL['term_search']>(
                'term_search',
            ),
        filters: <T>() => this.preparar_query<T>('filters'),
        form_object_sequence: this.preparar_query<
            QUERY_PARAMS_GENERAL['form_object_sequence']
        >('form_object_sequence'),
        form_mode:
            this.preparar_query<QUERY_PARAMS_GENERAL['form_mode']>('form_mode'),
    };

    private accion<T>(nombre: string) {
        return {
            ocultar: () => this.ocultar(nombre),
            definir: (objeto: T) => this.definir<T>(nombre, objeto),
        };
    }

    private preparar_query<T>(nombre: string) {
        return {
            accion: this.accion<T>(nombre),
        };
    }

    private ocultar(nombre: string) {
        const PARAMS_ACTUALES = { ...this.route.snapshot.queryParams };
        delete PARAMS_ACTUALES[nombre];
        this.router.navigate([], {
            queryParams: PARAMS_ACTUALES,
            queryParamsHandling: 'merge',
            // replaceUrl: true
        });
    }

    private definir<T>(nombre: string, objeto: T) {
        this.router.navigate([], {
            queryParams: { [nombre]: JSON.stringify(objeto) },
            queryParamsHandling: 'merge',
            // replaceUrl: true
        });
    }

    define_multipe(query: QUERY_PARAMS_GENERAL, replaceUrl: boolean = false) {
        this.router.navigate([], {
            queryParams: query,
            queryParamsHandling: 'merge',
            replaceUrl,
        });
    }

    limpiar_todo() {
        this.router.navigate([], {
            queryParams: {},
            queryParamsHandling: 'replace',
            // replaceUrl: true
        });
    }
}

export interface QUERY_PARAMS_GENERAL {
    pagination?: Pagination;
    filters?: any;
    global_search?: string;
    term_search?: string;
    form_object_sequence?: number;
    form_mode?: 'detail' | 'edit' | 'create';
    id?: string;
}
