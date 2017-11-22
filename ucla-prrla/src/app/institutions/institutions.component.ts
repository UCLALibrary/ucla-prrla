import {Component, OnInit} from '@angular/core';
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
    constructor(private testService: SolrService) {
    }

    /**
     * Initializing data
     */
    ngOnInit() {
        this.testService.getPrrlaMembers().subscribe(data => {
            this.institutions = data.members;
        }, error => {
            ErrorComponent.showBackend();
        });
    }
}