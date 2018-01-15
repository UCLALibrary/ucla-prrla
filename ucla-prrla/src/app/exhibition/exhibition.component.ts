import {Component} from '@angular/core';
import {Params} from '@angular/router';
import {AdvancedSearchComponent} from '../advanced-search/advanced-search.component';
import {ErrorComponent} from '../error/error.component';


/**
 * This file if used to render Exhibition Page
 */
@Component({
    selector: 'app-exhibition',
    templateUrl: './exhibition.component.html'
})

export class ExhibitionComponent extends AdvancedSearchComponent {
    /**
     * Name of Exhibition
     * @type {string}
     */
    private name;

    /**
     * OnInit, loads default data
     */
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

                this.name = params['name'];

                this.selectedFilters = {
                    collectionName: [this.name],
                };

                this.setPage(this.url_page);
            }
        );
    }

    /**
     * OnDestroy releases route
     */
    ngOnDestroy() {
        if (this.route$) {
            this.route$.unsubscribe()
        }
    }

    /**
     * Set Page is used to reload data on page
     * @param page {number} - set page with data
     */
    setPage(page: number) {
        document.getElementById('loading').style.display = 'block';
        this.testService.getPaginatedBooks(this.search_therms, this.selectedFilters, page).subscribe(data => {
            this.items = data.items;
            this.pager = this.testService.getPager(data.totalItems, page);
            this.itemFilters = data.itemFilters;
            document.getElementById('loading').style.display = 'none';
        }, error => {
            ErrorComponent.showBackend();
            document.getElementById('loading').style.display = 'none';
        });
    }

    /**
     * Is used to navigate to another page
     * @param page {number} - set page with data
     * @param filters {string} - set selected filters
     * @param therms {string} - set selected terms
     * @param orderBy {string} - set selected order
     */
    navigateWithParams(page, filters, therms, orderBy) {
        this.router.navigate(['/exhibition'], {
            queryParams: {
                name: this.name,
                page: page,
                order: orderBy
            }
        });
    }
}
