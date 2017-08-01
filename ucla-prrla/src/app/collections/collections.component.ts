import {Component, OnInit} from '@angular/core';
import {TestService} from '../services/test.service';
import {element} from "protractor";
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
    selector: 'app-collections',
    templateUrl: './collections.component.html'
})
export class CollectionsComponent implements OnInit {

    name: string;
    list: any;
    selected: any = 'Browse by Institution';
    rows: any = [];

    public universities = [];
    public collections = [];
    public collectionsByUniversity = {};
    public universitiesByCollections = {};

    constructor(private testService: TestService, private router: Router) {
        this.list = [
            'Browse by Institution',
            'Browse by Collection Title'
        ];
    }

    ngOnInit() {
        this.testService.getUniversities().subscribe(data => {
            this.universities = data.universities;
        });
        this.testService.getCollections().subscribe(data => {
            this.collections = data.collections;
        });

    }

    selectButton(item) {
        this.selected = item;
    }

    isSelected(item) {
        return this.selected === item;
    }

    toggleUniversity(event) {
        let universityName = event.currentTarget.getAttribute('name');
        event.currentTarget.parentElement.classList.toggle('active');

        if (typeof this.collectionsByUniversity[universityName] === 'undefined') {
            this.testService.getCollectionsByUniversity(universityName).subscribe(data => {
                this.collectionsByUniversity[universityName] = data.collections;
            });
        }
    }

    toggleCollection(event) {
        let collectionName = event.currentTarget.getAttribute('name');
        event.currentTarget.parentElement.classList.toggle('active');

        if (typeof this.universitiesByCollections[collectionName] === 'undefined') {
            this.testService.getUniversitiesByCollection(collectionName).subscribe(data => {
                this.universitiesByCollections[collectionName] = data.institutions;
            });
        }
    }

    isLoadedUniversity(universityName) {
        return typeof this.collectionsByUniversity[universityName] !== 'undefined';
    }

    isLoadedCollection(collectionName) {
        return typeof this.universitiesByCollections[collectionName] !== 'undefined';
    }

    collectionClick(collectionName: string) {
        this.router.navigate(['/advanced-search'], {
            queryParams: {
                filters: JSON.stringify({
                    collectionName: [
                        collectionName
                    ],
                })
            }
        });
    }

    universityClick(universityName: string) {
        this.router.navigate(['/advanced-search'], {
            queryParams: {
                filters: JSON.stringify({
                    institutionName: [
                        universityName
                    ],
                })
            }
        });
    }
}
