import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';

/**
 * This file is used to render Help Page
 */
@Component({
    selector: 'app-help',
    templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {
    /**
     * Property becomes true if navigation need to be fixed
     * @type {boolean}
     */
    public navIsFixed: boolean = false;

    /**
     * Scrolls to id
     * @param location
     */
    goTo(location: string): void {
        window.location.hash = location;
    }

    /**
     * Constructor
     * @param document
     */
    constructor(@Inject(DOCUMENT) private document: Document) {
    }

    /**
     * OnInit
     */
    ngOnInit() {
    }

    /**
     * Binds scroll
     */
    @HostListener('window:scroll')
    onWindowScroll() {
        let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (number > 280) {
            this.navIsFixed = true;
        } else if (this.navIsFixed && number < 280) {
            this.navIsFixed = false;
        }
        // console.log(number);
    }
}
