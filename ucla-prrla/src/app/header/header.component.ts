import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';

/**
 * This file if used to render Header
 */
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    /**
     * Becomes `true` if site is in `production` mode or `false` if site is in `debug`
     */
    public prod;

    /**
     * Constructor
     */
    constructor() {

    }

    /**
     * Init
     */
    ngOnInit() {
        if (environment.production) {
            this.prod = true;
            console.log('prod');
        } else {
            this.prod = false;
            console.log('dev');
        }
    }
}