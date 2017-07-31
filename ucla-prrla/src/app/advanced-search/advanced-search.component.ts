import {Component, OnInit, OnDestroy} from '@angular/core';
import {TestService} from '../services/test.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {element} from 'protractor';
import {Subscription} from 'rxjs/Subscription';



@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
})

export class AdvancedSearchComponent implements OnInit {
  // books: Array<any>;
  // error: string;
  // displayValues = [];
  // pageOfItems: number;
  // changeShape;
  //
  // static changeShape (value?: number): void {}
  //
  // constructor(private http: Http, private booksService: BooksService) {
  //
  //   for (let i = 1; i <= 10; i++) {
  //     this.displayValues.push(`${i}`)
  //   }
  //
  // }
  //
  // clicked(event) {
  //   event.target.classList.toggle('active'); // To toggle
  // }
  //
  // ngOnInit() {
  //   this.booksService.getAllBooks()
  //     .subscribe(
  //       data => this.books = data,
  //       error => this.error = error.statusText,
  //     )
  // };

  url_page: any;
  route$: Subscription;
  public items = [];
  public itemFilters;
  public pager;

  public selectedFilters = {};

  public search_therms = '';

  constructor(
      private testService: TestService,
      private route: ActivatedRoute,
      private router: Router
  ) {
  }

  ngOnInit() {
    this.pager = this.testService.getPager(0);

    this.route$ = this.route.queryParams.subscribe(
        (params: Params) => {
          let page = +params['page'];
          if(!isNaN(page)){
            this.url_page = page;
          }
          let params_json = params['filters'];
          if(params_json){
            this.selectedFilters = JSON.parse(params_json);
          }else{
            this.selectedFilters = {};
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
      this.items = data.items;
      this.pager = this.testService.getPager(data.totalItems, page);
      this.itemFilters = data.itemFilters;
      document.getElementById('loading').style.display = 'none';
    });
  }

  toggleActiveClass(event) {
    event.target.classList.toggle('active');
  }

  pagerClick(event, page) {
    if(!event.target.parentElement.classList.contains('disabled')){
      this.navigateWithParams(page, this.selectedFilters);
    }
  }

  navigateWithParams(page, filters){
    this.router.navigate(['/test'], { queryParams: { page: page, filters: JSON.stringify(filters) } });
  }

  searchOnEnter(event) {
    this.search_therms = event.target.value;
    this.setPage(1);
  }

  clickOnFilter(event) {
    let filterName = event.target.name;
    let filterValue = event.target.value;
    let checked = event.target.checked;

    if(typeof this.selectedFilters[filterName] === 'undefined'){
      this.selectedFilters[filterName] = [];
    }

    let index = this.selectedFilters[filterName].indexOf(filterValue);

    if(checked){
      if(index === -1){
        this.selectedFilters[filterName].push(filterValue);
      }
    }else{
      if(index > -1){
        this.selectedFilters[filterName].splice(index, 1);
      }
    }

    if(this.selectedFilters[filterName].length == 0){
      delete this.selectedFilters[filterName];
    }

    this.navigateWithParams(1, this.selectedFilters);
  }

  getIsSelectedFilter(filterName, filterVal){
    if (typeof this.selectedFilters[filterName] === 'undefined'){
      return false;
    }

    if (this.selectedFilters[filterName].indexOf(filterVal) === -1){
      return false;
    }

    return true;
  }

  getIsSelectedFilterChecked(filterName, filterVal){
    if(this.getIsSelectedFilter(filterName, filterVal)){
      return 'checked';
    }else{
      return '';
    }
  }

}
