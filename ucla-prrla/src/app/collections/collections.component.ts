import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {SolrService} from '../services/solr.service';
import {element} from "protractor";
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorComponent} from "../error/error.component";
import {forEach} from "@angular/router/src/utils/collection";

/**
 * This file is used to render Collections Page
 */
@Component({
    selector: 'app-collections',
    templateUrl: './collections.component.html'
})
export class CollectionsComponent implements OnInit {
    /**
     * List of available types of page
     */
    public list: any;
    /**
     * Type of page: (Browse by Collection Title|Browse by Institution)
     * @type {string}
     */
    public selected: any = 'Browse by Institution';

    /**
     * Universities list
     * @type {Array}
     */
    public universities = [];

    /**
     * Collections list
     * @type {Array}
     */
    public collections = [];

    /**
     * University list with collections for each university
     * @type {Object}
     */
    public collectionsByUniversity = {};

    /**
     * Collections list with universities related
     * @type {Object}
     */
    public universitiesByCollections = {};

    /**
     * Constructor
     * Sets list with available types of page
     * @param testService
     * @param router
     * @param title
     */
    constructor(private testService: SolrService, private router: Router, private title: Title) {
        this.list = [
            'Browse by Institution',
            'Browse by Collection Title'
        ];
    }

    /**
     * Loads data
     */
    ngOnInit() {
        this.title.setTitle('Explore Collections | PRRLA Pacific Rim Library');
        this.testService.getUniversities().subscribe(data => {
            this.universities = data.universities;
        }, error => {
            ErrorComponent.showBackend();
        });
        this.testService.getCollections().subscribe(data => {
            this.collections = data.collections;

            for(let i in this.collections){
                let collection = this.collections[i];

                this.loadCollection(collection.realName);
            }
        }, error => {
            ErrorComponent.showBackend();
        });

    }

    /**
     * Select page type
     * @param item {string} - checking selected item for display collections or institutions
     */
    selectButton(item) {
        this.selected = item;
    }

    /**
     * returns if page type is selected
     * @param item {string} - checking selected item for display collections or institutions
     * @returns {boolean}
     */
    isSelected(item) {
        return this.selected === item;
    }

    /**
     * Toggles university on view
     * @param event
     */
    toggleUniversity(event) {
        let universityName = event.currentTarget.getAttribute('name');
        event.currentTarget.parentElement.classList.toggle('active');

        if (typeof this.collectionsByUniversity[universityName] === 'undefined') {
            this.testService.getCollectionsByUniversity(universityName).subscribe(data => {
                this.collectionsByUniversity[universityName] = data.collections;
            }, error => {
                ErrorComponent.showBackend();
            });
        }
    }

    /**
     * Toggles collection on view
     * @param event
     * @param collectionName {string} - collections names on view
     */
    toggleCollection(event, collectionName){

        this.loadCollection(collectionName);
    }

    /**
     * Loads collection by name
     * @param collectionName {string} - collections names on view
     */
    loadCollection(collectionName){
        if (typeof this.universitiesByCollections[collectionName] === 'undefined') {
            this.testService.getUniversitiesByCollection(collectionName).subscribe(data => {
                this.universitiesByCollections[collectionName] = data.institutions;
            }, error => {
                ErrorComponent.showBackend();
            });
        }
    }

    /**
     * Returns true if university is loaded
     * @param universityName {string} - university names on view
     * @returns {boolean}
     */
    isLoadedUniversity(universityName) {
        return typeof this.collectionsByUniversity[universityName] !== 'undefined';
    }

    /**
     * Returns true if collection is loaded
     * @param collectionName {string} - collections names on view
     * @returns {boolean}
     */
    isLoadedCollection(collectionName) {
        return typeof this.universitiesByCollections[collectionName] !== 'undefined';
    }

    /**
     * Handles click on collection
     * @param collectionName {string} - collections names on view
     * @param universityName {string} - university names on view
     */
    collectionClick(collectionName: string, universityName: string) {
        this.router.navigate(['/search'], {
            queryParams: {
                filters: JSON.stringify({
                    collectionName: [
                        collectionName
                    ],
                    institutionName: [
                        universityName
                    ],
                })
            }
        });
    }

    /**
     * Handles click on university
     * @param collectionName {string} - collections names on view
     * @param universityName {string} - university names on view
     */
    universityClick(universityName: string, collectionName: string) {
        this.router.navigate(['/search'], {
            queryParams: {
                filters: JSON.stringify({
                    institutionName: [
                        universityName
                    ],
                    collectionName: [
                        collectionName
                    ],
                })
            }
        });
    }
}
