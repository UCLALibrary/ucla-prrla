import {Component, OnInit} from '@angular/core';
import {SolrService} from '../services/solr.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {ErrorComponent} from '../error/error.component';

/**
 * This file is used to render Detail Item Page
 */
@Component({
    selector: 'app-detail-item',
    templateUrl: './detail-item.component.html'
})
export class DetailItemComponent implements OnInit {
    /**
     * Id of item
     */
    private id;

    /**
     * Route, is used to navigate
     */
    private route$: Subscription;

    /**
     * Route, is used to get params
     */
    private routeQuery$: Subscription;

    /**
     * Loaded item
     */
    public item;

    /**
     * Pagination Page
     * @type {number}
     */
    public s_page = 1;

    /**
     * Selected filters, used to return to search
     * @type {string}
     */
    public s_filters = '';

    /**
     * Search Therms, used to return to search
     * @type {string}
     */
    public s_therms = '';

    /**
     * Selected order, used to return to search
     * @type {string}
     */
    public s_order = '';

    /**
     * Becomes true if we can return to advanced search
     * @type {boolean}
     */
    public showBreadcrumbs = false;

    /**
     * Become true when page data is loaded
     * @type {boolean}
     */
    public loaded = false;

    /**
     * Constructor
     * @param testService SorlService
     * @param route
     */
    constructor(public testService: SolrService, private route: ActivatedRoute) {
    }

    /**
     * Init. Loads item data depending on route params
     */
    ngOnInit() {
        this.route$ = this.route.params.subscribe(
            (params: Params) => {
                this.id = params['id'];
            }
        );

        this.routeQuery$ = this.route.queryParams.subscribe(
            (params: Params) => {
                let page = +params['s_page'];
                if (!isNaN(page)) {
                    this.s_page = page;
                } else {
                    this.s_page = 1;
                }
                this.s_filters = params['s_filters'];
                this.s_therms = params['s_therms'];
                this.s_order = params['s_order'];

                if (
                    typeof this.s_filters !== "undefined" &&
                    typeof this.s_therms !== "undefined" &&
                    typeof this.s_order !== "undefined"
                ) {
                    this.showBreadcrumbs = true;
                }
            }
        );

        this.testService.getItemById(this.id).subscribe(data => {
            this.item = data;
            this.loaded = true;
        }, error => {
            ErrorComponent.showBackend();
        });
    }

    /**
     * OnDestroy. Releases route
     */
    ngOnDestroy() {
        if (this.route$) {
            this.route$.unsubscribe();
            this.routeQuery$.unsubscribe();
        }
    }
}