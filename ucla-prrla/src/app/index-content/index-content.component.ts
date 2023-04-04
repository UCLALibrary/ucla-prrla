import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

/**
 * This file if used to render Index Page Content
 */
@Component({
  selector: 'app-index-content',
  templateUrl: './index-content.component.html'
})
export class IndexContentComponent implements OnInit {

  /**
   * Constructor
   */
  constructor(private title: Title) {}


  /**
   * Init
   */
  ngOnInit() {
    this.title.setTitle('Home | PRL');
  }

}
