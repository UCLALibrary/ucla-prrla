import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {

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
