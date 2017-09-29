import {Component, OnInit} from '@angular/core';
import {TestService} from '../services/test.service';
import {ErrorComponent} from '../error/error.component';

@Component({
    selector: 'app-institutions',
    templateUrl: './institutions.component.html'
})
export class InstitutionsComponent implements OnInit {
    public institutions = [];

    constructor(private testService: TestService) {
    }

    ngOnInit() {
        this.testService.getPrrlaMembers().subscribe(data => {
            this.institutions = data.members;
        }, error => {
            ErrorComponent.showBackend();
        });

        // this.testService.getUniversities().subscribe(data => {
        //     this.institutions = data.universities;
        // }, error => {
        //     ErrorComponent.showBackend();
        // });
    }
}