import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

/**
 * Is used to render Search Box
 */
@Component({
    selector: 'app-general-search-box',
    templateUrl: './general-search-box.component.html'
})
export class GeneralSearchBoxComponent implements OnInit {
    /**
     * Search Therms
     */
    public search;

    /**
     * Constructor
     * @param router
     */
    constructor(private router: Router) {
    }

    /**
     * Opens advanced search page with search therms on click
     * @param therms
     */
    btnClick(therms: string) {
        this.doNavigation(therms);
    }

    /**
     * Opens advanced search page with search therms on enter
     * @param event
     */
    onEnter(event: any) { // without type info
        this.doNavigation(event.currentTarget.value);
    }

    /**
     * Navigate to advanced search page
     * @param therms
     */
    doNavigation(therms: string) {
        this.router.navigate(['/search'], {queryParams: {therms: therms}});
    }

    /**
     * OnInit
     */
    ngOnInit() {
    }

}
