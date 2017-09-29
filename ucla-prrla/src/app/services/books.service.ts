import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()

export class BooksService {

  constructor(private http: Http) {  }
  getAllBooks() {
    return this.http.get('http://test-solr.library.ucla.edu/solr/prrla/select?q=*big*&rows=10&start=2000&wt=json').map(res => res.json());  /*test service*/
    // return this.http.get('http://solr.library.ucla.edu/solr/prrla/select?q=*big*&rows=10&start=2000&wt=json').map(res => res.json());   /*prod service*/
  }
}
