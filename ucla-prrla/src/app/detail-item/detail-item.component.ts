import {Component, OnInit} from '@angular/core';
import {TestService} from '../services/test.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
// import {Pipe, TransformPipe} from '../truncate.pipe';

import { books } from '../../data/books';
import {ErrorComponent} from '../error/error.component';

@Component({
  selector: 'app-detail-item',
  templateUrl: './detail-item.component.html'
})

// export class DetailItemComponent implements OnInit, OnDestroy {
//   private id;
//   private route$: Subscription;
//
//   books: Array<any> = books;
//
//
//   constructor(private route: ActivatedRoute) {
//
//   }
//
//   ngOnInit() {
//     this.route$ = this.route.params.subscribe(
//         (params: Params) => {
//           this.id = +params['id']; // cast to number
//         }
//     );
//   }
//   ngOnDestroy() {
//     if (this.route$) {
//       this.route$.unsubscribe()
//     }
//   }
// }

export class DetailItemComponent implements OnInit {
  private id;
  private route$: Subscription;
  private routeQuery$: Subscription;
  public item;

  public s_page = 1;
  public s_filters = '';
  public s_therms = '';
  public s_order = '';

  public loaded = false;

  constructor(public testService: TestService, private route: ActivatedRoute) {
  }


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
          }else{
            this.s_page = 1;
          }
          this.s_filters = params['s_filters'];
          this.s_therms = params['s_therms'];
          this.s_order = params['s_order'];
        }
    );

    this.testService.getItemById(this.id).subscribe(data => {
      this.item = data;
      console.log(data);
      this.loaded = true;
    }, error => {
      ErrorComponent.showBackend();
    });
  }

  ngOnDestroy() {
    if (this.route$) {
      this.route$.unsubscribe();
      this.routeQuery$.unsubscribe();
    }
  }
}