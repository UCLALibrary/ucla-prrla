import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AdvancedSearchComponent } from './../advanced-search/advanced-search.component';
import { Subscription } from 'rxjs/Subscription';


import { books } from '../../data/books';

@Component({
  selector: 'app-detail-item',
  templateUrl: './detail-item.component.html'
})
export class DetailItemComponent implements OnInit, OnDestroy {
  private id;
  private route$: Subscription;

  books: Array<any> = books;


  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route$ = this.route.params.subscribe(
        (params: Params) => {
          this.id = +params['id']; // cast to number
        }
    );
  }
  ngOnDestroy() {
    if (this.route$) {
      this.route$.unsubscribe()
    }
  }
}
