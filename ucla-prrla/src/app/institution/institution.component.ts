import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {SolrService} from '../services/solr.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
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
     * Institution Name {string}
     */
    private name;

    /**
     * The prrla_member_title field in the corresponding Solr document
     * @type {string}
     */
    public title;

    /**
     * The prrla_member_description field in the corresponding Solr document (may contain HTML)
     * @type {SafeHtml}
     */
    public description: SafeHtml;

    /**
     * The prrla_member_location field in the corresponding Solr document
     * @type {string}
     */
    public location;

    /**
     * The prrla_member_phone field in the corresponding Solr document
     * @type {string}
     */
    public phone;

    /**
     * The prrla_member_email field in the corresponding Solr document
     * @type {string}
     */

    public email;

    /**
     * The prrla_member_web_contact field in the corresponding Solr document
     * @type {string}
     */
    public webContact;

    /**
     * The prrla_member_website field in the corresponding Solr document
     * @type {string}
     */
    public website;

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
    public route$: Subscription;

    /**
     * Constructor
     * @param testService SorlService
     * @param route ActivatedRoute
     * @param router Router
     * @param title Title
     */
    constructor(
        public testService: SolrService,
        public route: ActivatedRoute,
        public router: Router,
        private title: Title,
        public domSanitizer: DomSanitizer
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
                this.title.setTitle(`${this.name} | PRL`)

                this.testService.getPrrlaMemberInfoByName(this.name).subscribe(data => {
                    this.title = data.memberInfo.prrla_member_title;
                    this.description = this.domSanitizer.bypassSecurityTrustHtml(data.memberInfo.prrla_member_description);
                    this.location = data.memberInfo.prrla_member_location;
                    this.phone = data.memberInfo.prrla_member_phone;
                    this.email = data.memberInfo.prrla_member_email;
                    this.webContact = data.memberInfo.prrla_member_web_contact;
                    this.website = data.memberInfo.prrla_member_website;

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
