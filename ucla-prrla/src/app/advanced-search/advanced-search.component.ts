import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {SolrService} from '../services/solr.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {ErrorComponent} from '../error/error.component';

/**
 * This file if used to render Advanced Search Page
 */
@Component({
    selector: 'app-advanced-search',
    templateUrl: './advanced-search.component.html',
})
export class AdvancedSearchComponent implements OnInit {
    /**
     * Page Number {number} in Url
     */
    public url_page: any;

    /**
     * Route {string} - params in url
     */
    route$: Subscription;

    /**
     * Loaded Items from solr data
     * @type {Array} items - all data from solr
     */
    public items = [];

    /**
     * Filters {array} - get filters from solr
     */
    public itemFilters;

    /**
     * Pager {number} - total pages with items
     */
    public pager;

    /**
     * Page Size {number} - total items on page
     */
    public pageSize;

    /**
     * Order By - selected order for sorting
     * @type {string}
     */
    public orderBy = '';

    /**
     * Available Orders
     * @type {Array} Available Orders - orders for sorting items
     */
    public availableOrders = [];

    /**
     * Selected Filters
     * @type {string}
     */
    public selectedFilters = {};

    /**
     * Selected Filters in JSON
     * @type {string}
     */
    public selectedFiltersJsonString = '';

    /**
     * Search therms
     * @type {string}
     */
    public search_therms = '';

    /**
     * Flag that indicates if page is initializing or not
     * @type {boolean}
     */
    public initializing_first_time = true;

    /**
     * Constructor
     * @param testService SolrService
     * @param route ActivatedRoute
     * @param router Router
     * @param title Title
     */
    constructor(
        public testService: SolrService,
        public route: ActivatedRoute,
        public router: Router,
        private title: Title
    ) {
    }

    /**
     * OnInit, loads default data
     */
    ngOnInit() {
        this.title.setTitle('Search | PRL');
        this.pager = this.testService.getPager(0);
        this.pageSize = this.testService.pageSize;
        this.availableOrders = this.testService.availableOrders;

        this.route$ = this.route.queryParams.subscribe(
            (params: Params) => {
                let page = +params['page'];
                if (!isNaN(page)) {
                    this.url_page = page;
                }
                let params_json = params['filters'];
                if (params_json) {
                    this.selectedFilters = JSON.parse(params_json);
                } else {
                    this.selectedFilters = {};
                }

                let therms = params['therms'];
                if (therms) {
                    this.search_therms = therms;
                }

                let orderBy = params['order'];
                if (orderBy) {
                    this.orderBy = orderBy;
                }

                this.setPage(this.url_page);
            }
        );

        this.setPage(this.url_page);
    }

    /**
     * OnDestroy releases route
     */
    ngOnDestroy() {
        if (this.route$) {
            this.route$.unsubscribe();
        }
    }

    /**
     * Loads page data
     * @param page {number} - set page with data
     */
    setPage(page: number) {
        document.getElementById('loading').style.display = 'block';
        this.testService.getPaginatedBooks(this.search_therms, this.selectedFilters, page).subscribe(data => {
            this.initializing_first_time = false;
            this.items = data.items;
            this.pager = this.testService.getPager(data.totalItems, page);
            this.itemFilters = data.itemFilters;
            document.getElementById('loading').style.display = 'none';
        }, error => {
            console.log(error);
            ErrorComponent.showBackend();
            document.getElementById('loading').style.display = 'none';
        });
    }

    /**
     * Changes page size and jumps to first page
     */
    pageSizeChange() {
        this.testService.pageSize = this.pageSize;
        this.setPage(1);
    }

    /**
     * Changes orderBy and jumps to first page
     */
    orderByChange() {
        this.testService.orderBy = this.orderBy;
        this.setPage(1);
        this.navigateWithParams(1, this.selectedFilters, this.search_therms, this.orderBy);
    }

    /**
     * Toggles `active` class
     * @param event
     */
    toggleActiveClass(event) {
        event.target.classList.toggle('active');
    }

    /**
     * Clears inputs
     * @param event
     */
    clearInputs(event) {
        event.preventDefault();
        this.selectedFilters = {};
        this.search_therms = '';
        this.selectedFiltersJsonString = '';
        this.navigateWithParams(1, this.selectedFilters, this.search_therms, this.orderBy);
    }

    /**
     * Handles click on page
     * @param event
     * @param page {number} - set page with data
     */
    pagerClick(event, page) {
        if (!event.target.parentElement.classList.contains('disabled')) {
            this.navigateWithParams(page, this.selectedFilters, this.search_therms, this.orderBy);
        }
    }

    /**
     * Navigates to specific page with selected filters and params
     * @param page {number} - set page with data
     * @param filters {string} - set selected filters
     * @param therms {string} - set selected terms
     * @param orderBy {string} - set selected order
     */
    navigateWithParams(page, filters, therms, orderBy) {
        this.router.navigate(['/search'], {
            queryParams: {
                page: page,
                filters: JSON.stringify(filters),
                therms: therms,
                order: orderBy
            }
        });
    }

    /**
     * Handles enter click
     * @param event
     */
    searchOnEnter(event) {
        this.search_therms = event.target.value;
        this.setPage(1);
        this.navigateWithParams(1, this.selectedFilters, this.search_therms, this.orderBy);
    }

    /**
     * Handles click on search button
     * @param therms {string} - set selected terms
     */
    searchButtonClick(therms: string) {
        this.search_therms = therms;
        this.setPage(1);
        this.navigateWithParams(1, this.selectedFilters, this.search_therms, this.orderBy);
    }

    /**
     * Handles click on filter
     * @param event
     */
    clickOnFilter(event) {
        let filterName = event.target.name;
        let filterValue = event.target.value;
        let checked = event.target.checked;

        if (typeof this.selectedFilters[filterName] === 'undefined') {
            this.selectedFilters[filterName] = [];
        }

        let index = this.selectedFilters[filterName].indexOf(filterValue);

        if (checked) {
            if (index === -1) {
                this.selectedFilters[filterName].push(filterValue);
            }
        } else {
            if (index > -1) {
                this.selectedFilters[filterName].splice(index, 1);
            }
        }

        if (this.selectedFilters[filterName].length == 0) {
            delete this.selectedFilters[filterName];
        }

        this.selectedFiltersJsonString = JSON.stringify(this.selectedFilters);

        this.navigateWithParams(1, this.selectedFilters, this.search_therms, this.orderBy);
    }

    /**
     * Handles click on item, opens Item Detail page
     * @param item_id {number} - set selected item id
     * @returns {boolean}
     */
    clickOnItem(item_id){
        this.router.navigate(['/detail', item_id], {
            queryParams: {
                s_page: this.url_page,
                s_filters: JSON.stringify(this.selectedFilters),
                s_therms: this.search_therms,
                s_order: this.orderBy
            }
        });

        return false;
    }

    /**
     * Returns true if filter is selected
     * @param filterName {string} - set name of filter
     * @param filterVal {string} - set value of filter
     * @returns {boolean}
     */
    getIsSelectedFilter(filterName, filterVal) {
        filterVal = filterVal + "";

        if (typeof this.selectedFilters[filterName] === 'undefined') {
            return false;
        }

        if (this.selectedFilters[filterName].indexOf(filterVal) === -1) {
            return false;
        }

        return true;
    }

    /**
     * returns `checked` string if filter is selected
     * @param filterName {string} - set name of filter
     * @param filterVal {string} - set value of filter
     * @returns {any}
     */
    getIsSelectedFilterChecked(filterName, filterVal) {
        if (this.getIsSelectedFilter(filterName, filterVal)) {
            return 'checked';
        } else {
            return '';
        }
    }

}
