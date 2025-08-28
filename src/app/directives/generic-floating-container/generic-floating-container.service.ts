import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { GenericFloatingContainerDirective } from './generic-floating-container.directive';
import { ActiveContainerData } from './generic-floating-container.model';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GenericFloatingContainerService {
    private active_containers: Map<string, ActiveContainerData> = new Map();
    private renderer2!: Renderer2;

    constructor(private rendererFactory: RendererFactory2) {
        this.renderer2 = this.rendererFactory.createRenderer(null, null);
    }

    register_container(directive: GenericFloatingContainerDirective) {
        let container = directive.HTML_container;
        let current_host = directive.HTML_host;
        const DIRECT_PARENT = this.active_containers.get(
            current_host?.closest('.floating-container')?.id ?? '',
        );
        while (true) {
            const CURRENT_PARENT = current_host?.closest('.floating-container');
            if (!CURRENT_PARENT) {
                break;
            } else {
                let parent_data = this.active_containers.get(CURRENT_PARENT.id);
                if (parent_data) {
                    if (!parent_data.children) {
                        if (container) {
                            parent_data.children = [
                                {
                                    element: container,
                                    directive: directive,
                                },
                            ];
                        }
                        this.active_containers.set(
                            parent_data.element.id,
                            parent_data,
                        );
                        current_host = directive.HTML_host;
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        if (container?.id) {
            this.active_containers.set(container.id, {
                element: container,
                directive: directive,
                parent: DIRECT_PARENT
                    ? {
                          element: DIRECT_PARENT.element,
                          directive: DIRECT_PARENT.directive,
                      }
                    : undefined,
            });
        }
    }

    unregister_container(directive: GenericFloatingContainerDirective) {
        const CONTAINER_DATA = this.active_containers.get(
            directive.container_id,
        );
        this.active_containers.delete(directive.container_id);
        let current_parent = CONTAINER_DATA?.parent;
        while (current_parent) {
            const CURRENT_ID = current_parent.directive.container_id;
            let current_parent_data = this.active_containers.get(CURRENT_ID);
            if (current_parent_data?.children) {
                current_parent_data.children =
                    current_parent_data?.children?.filter((children) => {
                        return children.directive.container_id !== CURRENT_ID;
                    });
                this.active_containers.set(CURRENT_ID, current_parent_data);
            }
            current_parent = current_parent_data?.parent;
        }
    }

    send_should_keep_open_signal(directive: GenericFloatingContainerDirective) {
        const ID = directive.container_id;
        const DATA = this.active_containers.get(ID);
        let current_parent = DATA?.parent;
        while (current_parent) {
            current_parent.directive.should_keep_open$.next();
            const ID = current_parent.directive.container_id;
            current_parent = this.active_containers.get(ID)?.parent;
        }
    }

    send_should_close_signal(directive: GenericFloatingContainerDirective) {
        const ID = directive.container_id;
        const DATA = this.active_containers.get(ID);
        for (const CHILD of DATA?.children ?? []) {
            CHILD.directive.should_close$.next();
        }
        let current_parent = DATA?.parent;
        while (current_parent) {
            current_parent.directive.should_close$.next();
            const ID = current_parent.directive.container_id;
            current_parent = this.active_containers.get(ID)?.parent;
        }
    }

    close_all_containers() {
        for (const [ID, CONTAINER_DATA] of this.active_containers.entries()) {
            CONTAINER_DATA.directive.close_container();
            this.active_containers.delete(ID);
        }
    }

    close_container_by_id(id: string) {
        const CONTAINER_DATA = this.active_containers.get(id);
        const DIRECTIVE = CONTAINER_DATA?.directive;
        if (DIRECTIVE) {
            this.send_should_close_signal(DIRECTIVE);
            CONTAINER_DATA?.directive?.close_container();
        }
    }
}
