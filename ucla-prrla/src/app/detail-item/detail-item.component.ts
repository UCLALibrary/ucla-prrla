import {Component, OnInit} from '@angular/core';
import {TestService} from '../services/test.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';


import { books } from '../../data/books';

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

  constructor(private testService: TestService, private route: ActivatedRoute, private router: Router) {
  }

  btnClick = function () {
    this.router.navigateByUrl('/advanced-search');
  };
  onEnter(event: any) { // without type info
    this.router.navigateByUrl('/advanced-search');
  }

  ngOnInit() {
    this.route$ = this.route.params.subscribe(
        (params: Params) => {
          this.id = params['id'];
        }
    );

    this.testService.getItemById(this.id).subscribe(data => {
      this.item = data;
    });
  }

  ngOnDestroy() {
    if (this.route$) {
      this.route$.unsubscribe()
    }
  }
}
