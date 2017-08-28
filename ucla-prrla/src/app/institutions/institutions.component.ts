import {Component, OnInit} from '@angular/core';
import {TestService} from "../services/test.service";

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
        });
    }
}