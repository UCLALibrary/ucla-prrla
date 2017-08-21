import {Component, OnInit} from '@angular/core';
import {TestService} from '../services/test.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AdvancedSearchComponent} from '../advanced-search/advanced-search.component';

@Component({
    selector: 'app-exhibition',
    templateUrl: './exhibition.component.html'
})

export class ExhibitionComponent extends AdvancedSearchComponent {
    private name;

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

    ngOnDestroy() {
        if (this.route$) {
            this.route$.unsubscribe()
        }
    }

    setPage(page: number) {
        document.getElementById('loading').style.display = 'block';
        this.testService.getPaginatedBooks(this.search_therms, this.selectedFilters, page).subscribe(data => {
            this.items = data.items;
            this.pager = this.testService.getPager(data.totalItems, page);
            this.itemFilters = data.itemFilters;
            document.getElementById('loading').style.display = 'none';
        });
    }

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
