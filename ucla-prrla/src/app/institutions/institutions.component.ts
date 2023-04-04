import {Component, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {SolrService} from '../services/solr.service';
import {ErrorComponent} from '../error/error.component';

/**
 * Is used to render Institutions Page
 */
@Component({
    selector: 'app-institutions',
    templateUrl: './institutions.component.html'
})
export class InstitutionsComponent implements OnInit {
    /**
     * Institutions Array
     */
    public institutions = [];

    /**
     * Constructor
     */
    constructor(private testService: SolrService, private title: Title) {
    }

    /**
     * Initializing data
     */
    ngOnInit() {
        this.title.setTitle('Institutions | PRL');
        this.testService.getPrrlaMembers().subscribe(data => {
            this.institutions = data.members;
        }, error => {
            ErrorComponent.showBackend();
        });
    }
}