import { isPlatformBrowser } from '@angular/common';
import {
    Directive,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
    PLATFORM_ID,
    Renderer2,
} from '@angular/core';

@Directive({
    selector: '[collapse]',
})
export class CollapsibleElementDirective implements OnInit {
    // (o==================================================================o)
    //   #region INITIALIZATION
    // (o-----------------------------------------------------------\/-----o)

    constructor(
        private elementRef: ElementRef,
        private renderer2: Renderer2,
        @Inject(PLATFORM_ID) private platform_id: Object
    ) {}

    ngOnInit(): void {
        this.create_initial_setup();
        if (this.orientation === 'horizontal') {
            this.collapse_element_horizontally()
        } else if (this.orientation === 'vertical') {
            this.collapse_element_vertically()
        }
        this.subscribe_to_all_changes();
        this.create_event_listeners();
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion INITIALIZATION
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region INPUTS
    // (o-----------------------------------------------------------\/-----o)

    private collapsing: boolean = false;
    @Input('collapse') set _collapsing(collapsing: boolean) {
        this.collapsing = collapsing;
        this.process_collapse();
    }
    @Input({ required: true }) orientation!: 'vertical' | 'horizontal';
    @Output() transition_end: EventEmitter<void> = new EventEmitter();
    @Output() transition_start: EventEmitter<void> = new EventEmitter();
    @Output() starting_to_hide: EventEmitter<void> = new EventEmitter();
    @Output() starting_to_show: EventEmitter<void> = new EventEmitter();
    @Output() hidden: EventEmitter<void> = new EventEmitter();
    @Output() shown: EventEmitter<void> = new EventEmitter();

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion INPUTS
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region VARABLES
    // (o-----------------------------------------------------------\/-----o)

    collapsible_element!: HTMLElement;
    inner_container!: HTMLElement;
    inner_height!: number;
    inner_width!: number;
    resize_observer!: ResizeObserver;

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion VARABLES
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region ACTIONS
    // (o-----------------------------------------------------------\/-----o)

    subscribe_to_all_changes() {
        if (isPlatformBrowser(this.platform_id)) {
            this.resize_observer = new ResizeObserver((entry) => {
                this.calculate_actual_size();
                this.set_min_max_width();
                if (!this.collapsing) {
                    if (this.orientation === 'horizontal') {
                        this.extend_element_horizontally();
                    } else if (this.orientation === 'vertical') {
                        this.extend_element_vertically();
                    }
                }
            });

            this.resize_observer.observe(this.inner_container);
        }
    }

    create_initial_setup() {
        this.collapsible_element = this.elementRef.nativeElement;
        this.inner_container = this.renderer2.createElement('div');
        while (this.collapsible_element.childNodes.length > 0) {
            this.renderer2.appendChild(
                this.inner_container,
                this.collapsible_element.childNodes[0]
            );
        }
        this.renderer2.appendChild(
            this.collapsible_element,
            this.inner_container
        );
        this.calculate_actual_size();
        this.set_min_max_width();
        this.renderer2.setStyle(
            this.collapsible_element,
            'transition',
            'all 600ms'
        );
        this.renderer2.setStyle(this.collapsible_element, 'overflow', 'hidden');
        this.renderer2.setStyle(
            this.inner_container,
            'transition',
            'all 400ms'
        );
        this.renderer2.setStyle(this.inner_container, 'opacity', '100%');
    }

    process_collapse() {
        setTimeout(() => {
            this.emit_transition_start();
            this.start_displaying();
            if (this.collapsing) {
                this.emit_starting_to_hide();
                switch (this.orientation) {
                    case 'horizontal':
                        this.collapse_element_horizontally();
                        break;
                    case 'vertical':
                        this.collapse_element_vertically();
                        break;
                    default:
                        break;
                }
            } else {
                this.emit_starting_to_show();
                switch (this.orientation) {
                    case 'horizontal':
                        this.extend_element_horizontally();
                        break;
                    case 'vertical':
                        this.extend_element_vertically();
                        break;
                    default:
                        break;
                }
            }
        }, 0);
    }

    collapse_element_vertically() {
        this.calculate_actual_size();
        this.set_min_max_width();
        this.renderer2.setStyle(this.collapsible_element, 'height', '0px');
        this.renderer2.setStyle(this.inner_container, 'opacity', '0%');
    }

    extend_element_vertically() {
        this.calculate_actual_size();
        this.set_min_max_width();
        if (this.inner_height === 0) {
            this.renderer2.removeStyle(this.collapsible_element, 'height');
        } else {
            this.renderer2.setStyle(
                this.collapsible_element,
                'height',
                `${this.inner_height}px`
            );
        }
        this.renderer2.setStyle(this.inner_container, 'opacity', '100%');
    }

    collapse_element_horizontally() {
        this.renderer2.setStyle(this.collapsible_element, 'width', '0px');
        this.renderer2.setStyle(this.inner_container, 'opacity', '-30%');
    }

    extend_element_horizontally() {
        if (this.inner_width === 0) {
            this.renderer2.removeStyle(this.collapsible_element, 'width');
        } else {
            this.renderer2.setStyle(
                this.collapsible_element,
                'width',
                `${this.inner_width}px`
            );
        }
        this.renderer2.setStyle(this.inner_container, 'opacity', '100%');
    }

    calculate_actual_size() {
        this.inner_height = this.inner_container?.offsetHeight ?? 0;
        this.inner_width = this.inner_container?.offsetWidth ?? 0;
    }

    set_min_max_width() {
        this.renderer2.setStyle(
            this.inner_container,
            'max-width',
            `${this.inner_width}px`
        );
        this.renderer2.setStyle(
            this.inner_container,
            'min-width',
            `${this.inner_width}px`
        );
    }

    stop_displaying() {
        this.renderer2.setStyle(this.inner_container, 'display', 'none');
    }

    start_displaying() {
        this.renderer2.removeStyle(this.inner_container, 'display');
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion ACTIONS
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region EVENT LISTENERS
    // (o-----------------------------------------------------------\/-----o)

    create_event_listeners() {
        this.renderer2.listen(
            this.collapsible_element,
            'transitionend',
            (event: TransitionEvent) => {
                if (
                    event.propertyName === 'height' ||
                    event.propertyName === 'width'
                ) {
                    if (this.collapsing) {
						this.stop_displaying()
					}
                    this.emit_transition_end();
                    this.emit_hidden_if_so();
                    this.emit_shown_if_so();
                }
            }
        );
    }

    emit_transition_end() {
        this.transition_end.emit();
    }

    emit_transition_start() {
        this.transition_start.emit();
    }

    emit_hidden_if_so() {
        if (this.collapsing) {
            this.hidden.emit();
        }
    }

    emit_shown_if_so() {
        if (!this.collapsing) {
            this.shown.emit();
        }
    }

    emit_starting_to_show() {
        this.starting_to_show.emit();
    }

    emit_starting_to_hide() {
        this.starting_to_hide.emit();
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion EVENT LISTENERS
    // (o==================================================================o)
}
