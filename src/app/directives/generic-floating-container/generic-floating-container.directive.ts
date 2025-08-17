import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    EmbeddedViewRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    TemplateRef,
} from '@angular/core';
import { FloatingContainerData } from './generic-floating-container.model';
import { delay, map, merge, of, Subject, switchMap, takeUntil } from 'rxjs';

const MIN_TABLET_SCREEN_SIZE_PX = 991;
const DEFAUTL_MIN_HEIGHT_REM = 1.5;
const DEFAUTL_MIN_WIDTH_REM = 3.5;
const DEFAULT_PADDING_REM = 0.25;
const DEFAULT_SIZE = 'fit-content';
const DEFAULT_PLACEMENT = 'bottom';
const DEFAULT_CONTAINER_SEPARATION_PX = 5;
const DEFAULT_HIDE_DELAY = 400;

@Directive({
    selector: '[generic-floating-container]',
    standalone: true,
})
export class GenericFloatingContainerDirective implements OnInit, OnDestroy {
    // (o==================================================================o)
    //   #region INITIALIZATION
    // (o-----------------------------------------------------------\/-----o)

    @Input('generic-floating-container') set _container_data(
        value: FloatingContainerData,
    ) {
        setTimeout(() => {
            this.container_data = {
                ...this.container_data,
                ...value,
            };
        }, 0);
    }

    @Output('destroyed') destroyed_emitter: EventEmitter<void> =
        new EventEmitter();

    constructor(
        private renderer2: Renderer2,
        private element_ref: ElementRef,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.container_id = '_' + Math.round(Math.random() * 100000000);
        this.evaluate_screen_mode();
        this.HTML_host = this.element_ref.nativeElement;
        this.renderer2.addClass(this.HTML_host, 'floating-containers-host');
    }

    ngOnDestroy(): void {
        if (this.unlisten_enter) {
            this.unlisten_enter();
        }
        if (this.unlisten_leave) {
            this.unlisten_leave();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    // (o,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,o)
    //   #region    variables
    // (o''''''''''''''''''''''''v'''''o)

    container_data: FloatingContainerData = {
        size: DEFAULT_SIZE,
        min_height: `${DEFAUTL_MIN_HEIGHT_REM}rem`,
        min_width: `${DEFAUTL_MIN_WIDTH_REM}rem`,
        header_padding: `${DEFAULT_PADDING_REM}rem`,
        body_padding: `${DEFAULT_PADDING_REM}rem`,
        footer_padding: `${DEFAULT_PADDING_REM}rem`,
        full_screen_breakpoint: MIN_TABLET_SCREEN_SIZE_PX,
        placement: DEFAULT_PLACEMENT,
    };
    screen_mode: 'mobile-tablet' | 'desktop' = 'mobile-tablet';
    container_id!: string;
    container_visible: boolean = false;

    HTML_document_body: HTMLElement = document.body;
    HTML_host?: HTMLElement;
    HTML_backdrop?: HTMLElement;
    HTML_container?: HTMLElement;
    HTML_header?: HTMLElement;
    HTML_body?: HTMLElement;
    HTML_footer?: HTMLElement;
    EMBEDDED_header?: EmbeddedViewRef<any>;
    EMBEDDED_body?: EmbeddedViewRef<any>;
    EMBEDDED_footer?: EmbeddedViewRef<any>;

    private mouse_enter$ = new Subject<void>();
    private mouse_leave$ = new Subject<void>();
    private destroy$ = new Subject<void>();

    private unlisten_enter?: () => void;
    private unlisten_leave?: () => void;

    // (o,,,,,,,,,,,,,,,,,,,,,,,,^,,,,,o)
    //   #endregion variables
    // (o''''''''''''''''''''''''''''''o)

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion INITIALIZATION
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region LISTENERS
    // (o-----------------------------------------------------------\/-----o)

    @HostListener('window:resize')
    on_window_resize() {
        this.evaluate_screen_mode();
        this.positionate_container(
            this.container_data.placement ?? DEFAULT_PLACEMENT,
        );
    }

    @HostListener('window:scroll')
    on_window_scroll() {
        this.evaluate_screen_mode();
        this.positionate_container(
            this.container_data.placement ?? DEFAULT_PLACEMENT,
        );
    }

    @HostListener('click', ['$event'])
    on_click(event: MouseEvent) {
        this.toggle_container();
    }

    @HostListener('mouseenter')
    on_mouse_enter() {
        const EXISTS = !!document.getElementById(this.container_id);
        if (!(this.container_visible && EXISTS && this.HTML_container)) {
            this.create_container();
        }
        this.mouse_enter$.next();
    }

    @HostListener('mouseleave')
    on_mouse_leave() {
        this.mouse_leave$.next();
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion LISTENERS
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region RESPONSIVENESS
    // (o-----------------------------------------------------------\/-----o)

    evaluate_screen_mode() {
        if (
            window.innerWidth <
            (this.container_data.full_screen_breakpoint ??
                MIN_TABLET_SCREEN_SIZE_PX)
        ) {
            this.screen_mode = 'mobile-tablet';
        } else {
            this.screen_mode = 'desktop';
        }
        if (this.screen_mode === 'mobile-tablet') {
            this.container_data.full_screen = true;
        } else {
            this.container_data.full_screen = false;
        }
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion RESPONSIVENESS
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region STYLE MANAGEMENT
    // (o-----------------------------------------------------------\/-----o)

    assign_styles_to_element(
        element: HTMLElement,
        styles: { [type: string]: string },
    ) {
        for (const [STYLE_NAME, VALUE] of Object.entries(styles)) {
            this.renderer2.setStyle(element, STYLE_NAME, VALUE);
        }
    }

    remove_styles_of_element(element: HTMLElement, style_names: string[]) {
        for (const STYLE_NAME of style_names) {
            this.renderer2.removeStyle(element, STYLE_NAME);
        }
    }

    assign_properties_to_element(
        element: HTMLElement,
        properties: { [type: string]: string },
    ) {
        for (const [PROP_NAME, VALUE] of Object.entries(properties)) {
            this.renderer2.setAttribute(element, PROP_NAME, VALUE);
        }
    }

    remove_properties_of_element(
        element: HTMLElement,
        property_names: string[],
    ) {
        for (const PROP_NAME of property_names) {
            this.renderer2.removeAttribute(element, PROP_NAME);
        }
    }

    assign_classes_to_element() {}

    remove_classes_of_element() {}

    get_current_font_size() {
        const STYLE = window.getComputedStyle(this.HTML_document_body);
        const FONT_SIZE = parseFloat(STYLE.fontSize);
        return FONT_SIZE;
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion STYLE MANAGEMENT
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region CONTAINER BUILDING
    // (o-----------------------------------------------------------\/-----o)

    toggle_container() {
        const EXISTS = !!document.getElementById(this.container_id);
        if (this.container_visible && EXISTS && this.HTML_container) {
            this.destroy_container();
            this.ngOnDestroy();
        } else {
            this.create_container();
        }
    }

    destroy_container() {
        this.renderer2.removeChild(
            this.HTML_document_body,
            this.HTML_container,
        );
        this.container_visible = false;
        this.destroyed_emitter.emit();
    }

    create_container() {
        this.HTML_container = this.renderer2.createElement('div');
        this.unlisten_enter = this.renderer2.listen(
            this.HTML_container,
            'mouseenter',
            () => {
                this.mouse_enter$.next();
            },
        );
        this.unlisten_leave = this.renderer2.listen(
            this.HTML_container,
            'mouseleave',
            () => {
                this.mouse_leave$.next();
            },
        );

        const show$ = this.mouse_enter$.pipe(map(() => true));
        const hide$ = this.mouse_leave$.pipe(map(() => false));

        merge(show$, hide$)
            .pipe(
                switchMap((is_show: boolean) => {
                    if (is_show) {
                        return of(true);
                    } else {
                        return of(false).pipe(delay(DEFAULT_HIDE_DELAY));
                    }
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((visible) => {
                if (!visible) {
                    const EXISTS = !!document.getElementById(this.container_id);
                    if (
                        this.container_visible &&
                        EXISTS &&
                        this.HTML_container
                    ) {
                        this.destroy_container();
                        this.ngOnDestroy();
                    }
                } else {
                    this.positionate_container(
                        this.container_data?.placement ?? DEFAULT_PLACEMENT,
                    );
                }
            });

        if (this.HTML_container) {
            this.assign_styles_to_element(this.HTML_container, {
                isolation: 'isolate',
                position: 'fixed',
                contain: 'layout',
                'text-wrap': 'wrap',
                'z-index': '100',
                'backdrop-filter': 'blur(15px)',
                background: 'rgba(0, 0, 0, .2)',
                color: 'white',
                'box-shadow': '0px 4px 8px rgba(0, 0, 0, 0.3)',
                top: '0',
                left: '0',
                'min-height':
                    this.container_data.min_height ??
                    `${DEFAUTL_MIN_HEIGHT_REM}rem`,
                'min-width':
                    this.container_data.min_width ??
                    `${DEFAUTL_MIN_WIDTH_REM}rem`,
                padding:
                    this.container_data.body_padding ??
                    `${DEFAULT_PADDING_REM}rem`,
                overflow: 'auto',
                'border-radius': '.5rem',
                ...this.container_data?.container_css_styles,
            });
            this.assign_properties_to_element(this.HTML_container, {
                id: this.container_id,
            });
        }
        // if (this.container_data.header_content) {
        //     this.HTML_header = this.renderer2.createElement('div')
        // }
        this.HTML_body = this.renderer2.createElement('div');
        if (typeof this.container_data?.body_content === 'string') {
            this.renderer2.setProperty(
                this.HTML_body,
                'innerHTML',
                this.container_data.body_content,
            );
            if (this.HTML_body) {
                this.assign_styles_to_element(this.HTML_body, {
                    'white-space': 'pre-wrap',
                });
            }
        } else if (this.container_data?.body_content instanceof TemplateRef) {
            this.EMBEDDED_body =
                this.container_data.body_content.createEmbeddedView(
                    this.container_data.template_context || {},
                );
            this.EMBEDDED_body.rootNodes.forEach((node) => {
                this.renderer2.appendChild(this.HTML_body, node);
            });
            this.EMBEDDED_body.detectChanges();
        }

        this.renderer2.appendChild(this.HTML_container, this.HTML_body);
        this.renderer2.appendChild(
            this.HTML_document_body,
            this.HTML_container,
        );

        this.positionate_container(
            this.container_data?.placement ?? DEFAULT_PLACEMENT,
        );

        this.cdr?.detectChanges();
        this.container_visible = true;

        // if (this.container_data.footer_content) {
        //     this.HTML_footer = this.renderer2.createElement('div')
        // }
    }

    check_screen_bounds(placement: FloatingContainerData['placement']) {
        const container_position = this.HTML_container?.getBoundingClientRect();
        let top_correction = 0;
        let left_correction = 0;
        let recalculate = false;
        if ((container_position?.top ?? 0) < 0) {
            if (placement === 'top') {
                recalculate = true;
                placement = 'bottom';
            } else {
                top_correction = container_position?.top ?? 0;
            }
        }
        if ((container_position?.left ?? 0) < 0) {
            if (placement === 'left') {
                recalculate = true;
                placement = 'right';
            } else {
                left_correction = container_position?.left ?? 0;
            }
        }
        if ((container_position?.right ?? 0) > window.innerWidth) {
            if (placement === 'right') {
                recalculate = true;
                placement = 'left';
            } else {
                left_correction =
                    window.innerWidth - (container_position?.right ?? 0);
            }
        }
        if ((container_position?.bottom ?? 0) > window.innerHeight) {
            if (placement === 'bottom') {
                recalculate = true;
                placement = 'top';
            } else {
                top_correction =
                    window.innerHeight - (container_position?.bottom ?? 0);
            }
        }

        return {
            top_correction,
            left_correction,
            recalculate,
            placement,
        };
    }

    positionate_container(
        _placement: FloatingContainerData['placement'],
        _top_correction: number = 0,
        _left_correction: number = 0,
        iteration_number: number = 0,
    ): any {
        if (iteration_number > 8) {
            return;
        }

        const host_position = this.HTML_host?.getBoundingClientRect();
        const scroll_y = window.scrollY || this.HTML_document_body.scrollTop;
        const scroll_x = window.scrollX || this.HTML_document_body.scrollLeft;
        const container_height = this.HTML_container?.offsetHeight;
        const container_width = this.HTML_container?.offsetWidth;
        const viewport_height = window.innerHeight;
        const viewport_width = window.innerWidth;

        let top: number | undefined = 0;
        let left: number | undefined = 0;
        let max_width: number | undefined = 0;
        let max_height: number | undefined = 0;
        let min_width: number | undefined = 0;
        let min_height: number | undefined = 0;

        switch (_placement) {
            case 'top':
                top =
                    (host_position?.top ?? 0) +
                    scroll_y -
                    (container_height ?? 0) -
                    DEFAULT_CONTAINER_SEPARATION_PX;
                left = (host_position?.left ?? 0) + scroll_x;
                max_width = viewport_width;
                max_height = viewport_height + (container_height ?? 0) + top;
                break;
            case 'bottom':
                top =
                    (host_position?.bottom ?? 0) +
                    scroll_y +
                    DEFAULT_CONTAINER_SEPARATION_PX;
                left = (host_position?.left ?? 0) + scroll_x;
                max_width = viewport_width;
                max_height = viewport_height + (viewport_height - top);
                break;
            case 'right':
                top = host_position?.top ?? 0;
                left =
                    (host_position?.right ?? 0) +
                    scroll_x +
                    DEFAULT_CONTAINER_SEPARATION_PX;
                max_width = viewport_width - left;
                max_height = viewport_height;
                break;
            case 'left':
                top = host_position?.top;
                left =
                    (host_position?.left ?? 0) -
                    (container_width ?? 0) -
                    DEFAULT_CONTAINER_SEPARATION_PX;
                max_width = left + (container_width ?? 0);
                max_height = viewport_height;
                break;
            default:
                top =
                    (host_position?.top ?? 0) +
                    scroll_y -
                    (container_height ?? 0) -
                    DEFAULT_CONTAINER_SEPARATION_PX;
                left = (host_position?.left ?? 0) + scroll_x;
                max_width = viewport_width;
                max_height = viewport_height + (container_height ?? 0) + top;
                break;
        }

        if (this.HTML_container) {
            this.assign_styles_to_element(this.HTML_container, {
                'max-height': `${max_height}px`,
                'max-width': `${max_width}px`,
                top: `${top}px`,
                left: `${left}px`,
            });
        }

        const { top_correction, left_correction, recalculate, placement } =
            this.check_screen_bounds(_placement);

        if (recalculate) {
            return this.positionate_container(
                placement,
                top_correction,
                left_correction,
                iteration_number + 1,
            );
        }

        top = (top ?? 0) + top_correction;
        left = (left ?? 0) + left_correction;

        if (
            (this.HTML_container?.offsetWidth ?? 0) >=
                DEFAUTL_MIN_WIDTH_REM * this.get_current_font_size() &&
            !this.container_data.min_width
        ) {
            if ((this.HTML_container?.offsetWidth ?? 0) < max_height) {
                min_width = this.HTML_container?.offsetWidth ?? 0;
            } else {
                min_width = max_width;
            }
        }
        if (
            (this.HTML_container?.offsetHeight ?? 0) >=
                DEFAUTL_MIN_HEIGHT_REM * this.get_current_font_size() &&
            !this.container_data.min_height
        ) {
            if ((this.HTML_container?.offsetHeight ?? 0) < max_height) {
                min_height = this.HTML_container?.offsetHeight ?? 0;
            } else {
                min_height = max_height;
            }
        }

        if (this.HTML_container) {
            this.assign_styles_to_element(this.HTML_container, {
                'max-height': `${max_height}px`,
                'max-width': `${max_width}px`,
                'min-height': `${min_height}px`,
                'min-width': `${min_width}px`,
                top: `${top}px`,
                left: `${left}px`,
            });
        }

        // console.log('POS?.top: ', POS?.top);
        // console.log('POS?.left: ', POS?.left);
        // console.log('POS?.right: ', POS?.right);
        // console.log('POS?.bottom: ', POS?.bottom);
        // console.log('window height: ', window.innerHeight);
        // console.log('window width: ', window.innerWidth);
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion CONTAINER BUILDING
    // (o==================================================================o)
}
