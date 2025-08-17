import { TemplateRef } from '@angular/core';

export interface FloatingContainerData {
    header_content?: string | TemplateRef<any>;
    body_content?: string | TemplateRef<any>;
    footer_content?: string | TemplateRef<any>;
    template_context?: any;
    container_css_styles?: { [type: string]: string };
    container_css_classes?: string;
    // header_css_classes?: string;
    // header_css_styles?: { [type: string]: string };
    // body_css_classes?: string;
    // body_css_styles?: { [type: string]: string };
    // footer_css_classes?: string;
    // footer_css_styles?: { [type: string]: string };
    // show_mode?: 'hover' | 'click' | 'external';
    // mouse_behaviour?: 'hide_on_leave' | 'keep_always';
    // host_click_behaviour?: 'hide_on_click' | 'keep_always';
    // container_click_behaviour?: 'hide_on_click' | 'keep_always';
    // backdrop_click_behaviour?:
    //     | 'hide_on_click'
    //     | 'keep_always'
    //     | 'no_click_detection';
    // backdrop_mode?: 'blur' | 'opaque' | 'invisible';
    // backdrop_css_classes?: string;
    // backdrop_css_styles?: { [type: string]: string };
    // close_button?: 'show' | 'hide';
    // close_button_css_classes?: string;
    // close_button_css_styles?: { [type: string]: string };
    size?: 'fit-content' | 'sm' | 'md' | 'lg' | 'xl';
    header_padding?: string;
    body_padding?: string;
    footer_padding?: string;
    height?: string;
    width?: string;
    max_height?: string;
    max_width?: string;
    min_height?: string;
    min_width?: string;
    full_screen_breakpoint?: number;
    full_screen?: boolean;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

// export inteface FLoatingContainerStyles {

// }
