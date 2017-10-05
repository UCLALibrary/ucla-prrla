import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  public prod;


  constructor() {

  }

  ngOnInit() {
    if (environment.production) {
      this.prod = true;
      console.log('prod');
    } else {
      this.prod = false;
      console.log('dev');
    }
  }
}
