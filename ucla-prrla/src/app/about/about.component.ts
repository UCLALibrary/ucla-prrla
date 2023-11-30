import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

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
    constructor(private title: Title) {}

    /**
     * Init
     */
    ngOnInit() {
      this.title.setTitle('About | PRRLA Pacific Rim Library');
    }

}
