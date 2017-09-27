import {Component, OnInit, OnDestroy} from '@angular/core';
import {TestService} from '../services/test.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {element} from 'protractor';
import {Subscription} from 'rxjs/Subscription';
import {ErrorComponent} from "../error/error.component";

@Component({
    selector: 'app-advanced-search',
    templateUrl: './advanced-search.component.html',
})

export class AdvancedSearchComponent implements OnInit {
    url_page: any;
    route$: Subscription;
    public items = [];
    public itemFilters;
    public pager;
    public pageSize;
    public orderBy = '';
    public availableOrders = [];

    public selectedFilters = {};

    public search_therms = '';

    public initializing_first_time = true;

    constructor(
        public testService: TestService,
        public route: ActivatedRoute,
        public router: Router
    ) {
    }

    ngOnInit() {
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

    ngOnDestroy() {
        if (this.route$) {
            this.route$.unsubscribe();
        }
    }

    setPage(page: number) {
        document.getElementById('loading').style.display = 'block';
        this.testService.getPaginatedBooks(this.search_therms, this.selectedFilters, page).subscribe(data => {
            this.initializing_first_time = false;
            this.items = data.items;
            this.pager = this.testService.getPager(data.totalItems, page);
            this.itemFilters = data.itemFilters;
            document.getElementById('loading').style.display = 'none';
        }, error => {
            ErrorComponent.showBackend();
            document.getElementById('loading').style.display = 'none';
        });
    }

    pageSizeChange() {
        this.testService.pageSize = this.pageSize;
        this.setPage(1);
    }

    orderByChange() {
        this.testService.orderBy = this.orderBy;
        this.setPage(1);
        this.navigateWithParams(1, this.selectedFilters, this.search_therms, this.orderBy);
    }

    toggleActiveClass(event) {
        event.target.classList.toggle('active');
    }

    clearInputs(event){
        event.preventDefault();
        this.selectedFilters = {};
        this.search_therms = '';
        this.navigateWithParams(1, this.selectedFilters, this.search_therms, this.orderBy);
    }

    pagerClick(event, page) {
        if (!event.target.parentElement.classList.contains('disabled')) {
            this.navigateWithParams(page, this.selectedFilters, this.search_therms, this.orderBy);
        }
    }

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

    searchOnEnter(event) {
        this.search_therms = event.target.value;
        this.setPage(1);
        this.navigateWithParams(1, this.selectedFilters, this.search_therms, this.orderBy);
    }

    searchButtonClick(therms: string) {
        this.search_therms = therms;
        this.setPage(1);
        this.navigateWithParams(1, this.selectedFilters, this.search_therms, this.orderBy);
    }

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

        this.navigateWithParams(1, this.selectedFilters, this.search_therms, this.orderBy);
    }

    getIsSelectedFilter(filterName, filterVal) {
        if (typeof this.selectedFilters[filterName] === 'undefined') {
            return false;
        }

        if (this.selectedFilters[filterName].indexOf(filterVal) === -1) {
            return false;
        }

        return true;
    }

    getIsSelectedFilterChecked(filterName, filterVal) {
        if (this.getIsSelectedFilter(filterName, filterVal)) {
            return 'checked';
        } else {
            return '';
        }
    }

}
