import {Component, OnInit} from '@angular/core';
import {TestService} from "../services/test.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs/Subscription";

@Component({
    templateUrl: './test-detail.component.html'
})

export class TestDetailComponent implements OnInit {
    private id;
    private route$: Subscription;
    public item;

    constructor(private testService: TestService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route$ = this.route.params.subscribe(
            (params: Params) => {
                this.id = params['id'];
            }
        );

        this.testService.getItemById(this.id).subscribe(data => {
            this.item = data;
        });
    }

    ngOnDestroy() {
        if (this.route$) {
            this.route$.unsubscribe()
        }
    }
}