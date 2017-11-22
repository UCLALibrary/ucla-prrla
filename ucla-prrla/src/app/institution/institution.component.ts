import {Component, OnInit} from '@angular/core';
import {SolrService} from '../services/solr.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {ErrorComponent} from '../error/error.component';

/**
 * This file is used to render Institution Page
 */
@Component({
    selector: 'app-institution',
    templateUrl: './institution.component.html'
})
export class InstitutionComponent  implements OnInit {
    /**
     * Institution Name
     */
    private name;

    /**
     * Institution Info
     * @type {{}}
     */
    public memberInfo = {};

    /**
     * Institution Collections
     * @type {Array}
     */
    public collections = [];

    /**
     * Property become true if Institution Info loaded
     * @type {boolean}
     */
    public dataLoaded = false;

    /**
     * Route, used to get Route Params
     */
    route$: Subscription;

    /**
     * Constructor
     * @param testService SorlService
     * @param route ActivatedRoute
     * @param router Router
     */
    constructor(
        public testService: SolrService,
        public route: ActivatedRoute,
        public router: Router
    ) {
    }

    /**
     * OnInit
     * used to load Institution Info depending on Route Params
     */
    ngOnInit() {
        this.route$ = this.route.queryParams.subscribe(
            (params: Params) => {
                this.name = params['name'];

                this.testService.getPrrlaMemberInfoByName(this.name).subscribe(data => {
                    this.memberInfo = data.memberInfo;
                    this.dataLoaded = true;
                }, error => {
                    ErrorComponent.showBackend();
                });

                this.testService.getCollectionsByUniversity(this.name).subscribe(data => {
                    this.collections = data.collections;
                });
            }
        );

    }

    /**
     * OnDestroy, Releases Route
     */
    ngOnDestroy() {
        if (this.route$) {
            this.route$.unsubscribe()
        }
    }

    /**
     * Handles Click on Collection, Open Collection Page
     * @param collectionName
     */
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
