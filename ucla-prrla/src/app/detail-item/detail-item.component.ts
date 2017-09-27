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
  public item;

  public loaded = false;

  constructor(private testService: TestService, private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.route$ = this.route.params.subscribe(
        (params: Params) => {
          this.id = params['id'];
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
      this.route$.unsubscribe()
    }
  }
}