import { Component, OnInit } from '@angular/core';
import {SolrService} from '../services/solr.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ErrorComponent} from '../error/error.component';

/**
 * Is used to render Exhibitions Page
 */
@Component({
  selector: 'app-exhibitions',
  templateUrl: './exhibitions.component.html'
})
export class ExhibitionsComponent implements OnInit {
    /**
     * Array of collections (exhibitions)
     * @type {Array}
     */
  public collections = [];

    /**
     * Constructor
     * @param testService SolrService
     * @param route ActivatedRoute
     * @param router Router
     */
  constructor(private testService: SolrService, private route: ActivatedRoute, private router: Router) {}

    /**
     * Loads collections list
     */
  ngOnInit() {
      this.testService.getCollections().subscribe(data => {
          this.collections = data.collections;
      }, error => {
          ErrorComponent.showBackend();
      });
  }

    /**
     * Opens selected Collection
     * @param realName {string}
     */
  clickOnViewCollection(realName){
      this.router.navigate(['/exhibition'], {
          queryParams: {
              name: realName
          }
      });
  }

}
