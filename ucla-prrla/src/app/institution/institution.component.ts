import {Component, OnInit} from '@angular/core';
import {TestService} from '../services/test.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {ErrorComponent} from '../error/error.component';

@Component({
    selector: 'app-institution',
    templateUrl: './institution.component.html'
})


export class InstitutionComponent  implements OnInit {
    member_description: any;
    private name;
    public memberInfo = {};
    public collections = [];

    route$: Subscription;

    constructor(
        public testService: TestService,
        public route: ActivatedRoute,
        public router: Router
    ) {
    }

    ngOnInit() {
        this.route$ = this.route.queryParams.subscribe(
            (params: Params) => {
                this.name = params['name'];

                this.testService.getPrrlaMemberInfoByName(this.name).subscribe(data => {
                    this.memberInfo = data.memberInfo;
                }, error => {
                    ErrorComponent.showBackend();
                });

                this.testService.getCollectionsByUniversity(this.name).subscribe(data => {
                    this.collections = data.collections;
                });
            }
        );

    }

    ngOnDestroy() {
        if (this.route$) {
            this.route$.unsubscribe()
        }
    }

    collectionItemClick(collectionName: string) {
        this.router.navigate(['/search'], {
            queryParams: {
                filters: JSON.stringify({
                    collectionName: [
                        collectionName
                    ],
                })
            }
        });
    }
}
