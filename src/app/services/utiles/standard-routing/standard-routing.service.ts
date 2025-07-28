import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FragmentCallbackService } from '../fragment-callback/fragment-callback.service';
import { ControlQueriesService } from '../control-queries/control-queries.service';

@Injectable({
    providedIn: 'root',
})
export class StandardRoutingService {
    constructor(
        private router: Router,
        private fragment_service: FragmentCallbackService,
        private query_service: ControlQueriesService
    ) {}

    /**
     *
     * @param path_fragments The segments of the url
     * @param hash_fragment a fragment to add at the
     * @param clean
     */
    navigate(
        path_fragments: string[],
        hash_fragment?: DeepValues<
            typeof this.fragment_service.ALLOWED_FRAGMENTS,
            string
        >,
        clean: boolean = true
    ) {
        if (clean) {
            this.query_service.limpiar_todo();
            this.fragment_service.clean_fragment();
        }
        this.router.navigate(path_fragments, {
            // preserveFragment: true,
            // skipLocationChange: false,
        });
        if (hash_fragment) {
            this.fragment_service.add_fragment(hash_fragment);
        }
    }

    go_back() {
        this.query_service.limpiar_todo();
        setTimeout(() => {
            this.fragment_service.clean_fragment();
            setTimeout(() => {
                window.history.back();
            }, 0);
        }, 0);
    }

    open_form(object_id: string) {
        this.query_service.limpiar_todo();
        this.fragment_service.clean_fragment();
        setTimeout(() => {
            const CURRENT_URL = this.router.url.split('?')[0]
            this.navigate([CURRENT_URL ?? '', 'form']);
            setTimeout(() => {
                this.query_service.define_multipe({
                    id: object_id,
                    form_mode: 'detail',
                }, true)
            }, 0);
        })
    }
}
