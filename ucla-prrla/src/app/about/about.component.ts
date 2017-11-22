import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';


import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

/**
 * This file if used to render About Page
 */
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
    /**
    * Constructor
    */
    constructor() {}

    /**
     * Init
     */
    ngOnInit() {
    }

}
