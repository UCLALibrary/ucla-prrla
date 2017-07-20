import {Component, OnInit} from '@angular/core';
import {TestService} from "../services/test.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {element} from "protractor";
import {Subscription} from "rxjs/Subscription";

@Component({
    templateUrl: './test2.component.html'
})

export class Test2Component implements OnInit {
    public universities = [];
    public collectionsByUniversity = {};

    constructor(
        private testService: TestService,
    ) {
    }

    ngOnInit() {
        this.testService.getUniversities().subscribe(data => {
            this.universities = data.universities;
        });
    }

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