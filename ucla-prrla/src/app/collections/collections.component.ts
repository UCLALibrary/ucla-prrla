import { Component, OnInit } from '@angular/core';
import {TestService} from '../services/test.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {element} from "protractor";
import {Subscription} from "rxjs/Subscription";


@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html'
})
export class CollectionsComponent implements OnInit {

  name:string;
  list:any;
  selected:any;


  public universities = [];
  public collectionsByUniversity = {};

  constructor(private testService: TestService) {

    this.list = [
      'Browse by Institution',
      'Browse by Collection Title'
    ];

  }

  ngOnInit() {
    this.testService.getUniversities().subscribe(data => {
      this.universities = data.universities;
    });
  }

  selectButton(item) {
    this.selected = item;
  };
  isSelected(item) {
    return this.selected === item;
  };


  toggleUniversity(event) {
    let universityName = event.currentTarget.getAttribute('name');
    event.currentTarget.parentElement.classList.toggle('active');

    if(typeof this.collectionsByUniversity[universityName] === 'undefined'){
      this.testService.getCollectionsByUniversity(universityName).subscribe(data => {
        this.collectionsByUniversity[universityName] = data.collections;
      });
    }
  }

  isLoaded(universityName){
    return typeof this.collectionsByUniversity[universityName] !== 'undefined';
  }

}
