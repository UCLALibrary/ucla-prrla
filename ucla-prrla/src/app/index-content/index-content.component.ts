import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';


@Component({
  selector: 'app-index-content',
  templateUrl: './index-content.component.html'
})
export class IndexContentComponent implements OnInit {

  constructor(private router: Router) {}

  btnClick = function () {
    this.router.navigateByUrl('/advanced-search');
  };
  onEnter(event: any) { // without type info
    this.router.navigateByUrl('/advanced-search');
  }


  ngOnInit() {

  }

}
