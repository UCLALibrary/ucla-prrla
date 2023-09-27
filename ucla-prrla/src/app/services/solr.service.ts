import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Jsonp} from '@angular/http';
import {environment} from '../../environments/environment';

/**
 * Service to load data from Solr Backend
 */
@Injectable()
export class SolrService {
    /**
     * Base URL - this use for connect to base and get it to the application
     */
    private baseURL;
    // private baseURL = 'http://test-solr.library.ucla.edu/solr/prrla/'; /*test service*/
    // private baseURL = 'http://solr.library.ucla.edu/solr/prrla/'; /*prod service*/

    /**
     * Default Page Size for pagination
     * @type {number} Page Size - set displayed pages for pagination
     */
    public pageSize = 10;

    /**
     * Default Order By
     * @type {string} Order By - set type for sorting
     */
    public orderBy = '';

    /**
     * Available orders
     * @type {array} Available orders - orders for sorting items
     */
    public availableOrders = [
        { value: '', name: 'Relevance'},
        { value: 'first_title asc', name: 'Title (a-z)'},
        { value: 'first_title desc', name: 'Title (z-a)'},
        { value: 'sort_decade asc', name: 'Date (oldest first)'},
        { value: 'sort_decade desc', name: 'Date (newest first)'}
    ];

    /**
     * Constructor, sets Base Url depending on environment
     * @param _jsonp {array} - sets Base Url depending on environment
     */
    constructor(private _jsonp: Jsonp) {
        if (environment.production) {
            this.baseURL = 'https://p-u-prlsolr01.library.ucla.edu/solr/prl/';
            console.log('prod');
        } else {
            this.baseURL = 'https://t-u-prlsolr01.library.ucla.edu/solr/prl/';
            console.log('dev');
        }
    }

    /**
     * Escapes Apache Lucene special characters
     * @param value {array} - Escapes Apache Lucene special characters
     */
    public static escapeLucene(value){
        // https://lucene.apache.org/core/4_0_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html#Escaping_Special_Characters
        // only escape internal double quotes so users search for phrases
        // don't escape * so user can search with wildcards
        return value
            .replace(/(\+|-|(?:&&)|(?:\|\|)|!|\(|\)|\{|\}|\[|\]|\^|~|\?|:|\\|\/)/g, "\\$1")
            .replace(/^.+(").+/g, "\\$1");
    }

    /**
     * Returns Pager
     * @param totalItems {number} - all items from solr
     * @param currentPage {number} - start page default = 1
     * @param pageSize {number} - set displayed pages for pagination default = 10
     * @returns {{totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number, pages: Array}}
     */
    public getPager(totalItems: number, currentPage: number = 1, pageSize: number = this.pageSize) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage: number, endPage: number;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = [];
        for(let i=startPage;i<endPage+1;i++) {
            pages.push(i);
        }

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    /**
     * Returns Books with pagination
     * @param search {string} - get input search request
     * @param filters {array} - all checked filters
     * @param page {number} - start page default = 1
     * @returns {OperatorFunction<T, R>}
     */
    public getPaginatedBooks(search, filters, page = 1) {
        if(search == ''){
            search = '*';
        }

        let offset = (page - 1) * this.pageSize;
        let url =
            this.baseURL + 'select' + '?' +
            'q=' + encodeURIComponent(SolrService.escapeLucene(search)) + '&' +
            'df=text_multi&' +
            'rows=' + this.pageSize + '&' +
            'start=' + offset + '&' +
            'wt=jsonp&' +
            'sort=' + encodeURI(this.orderBy) + '&' +
            'facet=true&' +
            'facet.field=institutionName&' +
            'facet.field=collectionName&' +
            'facet.field=type_keyword&' +
            'facet.field=creator_keyword&' +
            'facet.field=decade&' +
            'facet.field=language_keyword&' +
            'facet.field=rights_keyword&' +
            'facet.field=source_keyword&' +
            'facet.field=description_keyword&' +
            'facet.field=identifier_keyword&' +
            'facet.field=thumbnail_url&' +

            'facet.field=title_keyword&' +
            'facet.field=subject_keyword&' +
            'facet.field=publisher_keyword&' +
            'facet.field=contributor_keyword&' +
            'facet.field=date_keyword&' +
            'facet.field=alternate_external_link&' +
            'facet.field=format_keyword&' +
            'facet.field=relation_keyword&' +
            'facet.field=coverage_keyword&' +

            'json.wrf=JSONP_CALLBACK';

        for(let filterName in filters){
            for(let filterVal in filters[filterName]){
                filterVal = filters[filterName][filterVal];
                url += '&fq=' + filterName + ':"' + encodeURIComponent(filterVal) + '"';
            }
        }

        return this._jsonp.get(url).map(data => {
            let totalRecords = data.json().response.numFound;
            let raw_items = data.json().response.docs;
            let items = [];

            for(let i in raw_items){
                let raw_item = raw_items[i];

                if(this.detectRegularItem(raw_item)){
                    let item = this.parseRawItem(raw_item);
                    items.push(item);
                }
            }

            let itemFilters = [];

            let facets = data.json().facet_counts.facet_fields;

            for(let facet_name in facets){
                let filterDisplayName = this.getFacetDisplayName(facet_name);

                if(filterDisplayName){
                    let filterItems = [];

                    let c = facets[facet_name].length;

                    for(let i = 0; i < c; i=i+2){
                        let count = facets[facet_name][i+1];

                        if(count){
                            let name = decodeURI(facets[facet_name][i]);
                            filterItems.push({
                                name: name,
                                humanName: name,
                                count: count,
                            });
                        }
                    }

                    if(filterDisplayName == 'Decade'){
                        for(var _i in filterItems){
                            filterItems[_i].key = parseInt(filterItems[_i].name);
                            filterItems[_i].humanName = this.makeHumanReadableDate(filterItems[_i].name);
                            filterItems[_i].name = parseInt(filterItems[_i].name);
                        }
                        filterItems.sort(SolrService.dynamicSort('-key'));
                    }

                    let itemFilter = {
                        name: facet_name,
                        displayName: filterDisplayName,
                        items: filterItems
                    };

                    itemFilters.push(itemFilter);
                }
            }

            return {
                items: items,
                totalItems: totalRecords,
                itemFilters: itemFilters,
            };
        });
    }

    /**
     * Converts minus in date string to B.C.E.
     * @param date {string} - get date from base
     * @returns {any} - date with B.C.E.
     */
    public makeHumanReadableDate(date){
        if(date && date[0] === "-"){
            date = date.substr(1) + ' B.C.E.';
        }

        return date;
    }

    /**
     * Returns Item info by ID
     * @param id {number} - number id of search item
     * @returns {OperatorFunction<T, R>}
     */
    public getItemById(id){
        let url =
            this.baseURL + 'select' + '?' +
            'q=' + encodeURI('id:' + SolrService.escapeLucene(id)) + '&' +
            'indent=true&' +
            'wt=jsonp&' +
            'json.wrf=JSONP_CALLBACK';

        return this._jsonp.get(url).map(data => {
            let raw_items = data.json().response.docs;

            if(raw_items.length > 0){
                // return this.parseRawItem(raw_items[0]);
                return this.parseRawItem(raw_items[0], true);
            }else{
                return false;
            }
        });
    }

    /**
     * Used to filter garbage in Solr Response
     * @param raw_item {string} - info about searched item by id
     * @returns {boolean}
     */
    private detectRegularItem(raw_item){
        return (
            typeof raw_item['title_keyword'] !== 'undefined' &&
            typeof raw_item['prrla_member_title'] == 'undefined'
        );
    }

    /**
     * Transforms Item Array from Solr response to Object
     * @param raw_item {string} - info about item by id
     * @param returnArrays {array} - default = false
     * @returns {{id, title: any, titles: any, alternative_title: boolean, first_line: boolean, collection: Array,
     * institution: Array, author: boolean, language: boolean, rights: boolean, source: boolean, description: boolean,
     * identifier: boolean, decade: boolean, subject: boolean, publisher: boolean, contributor: boolean, date: boolean,
     * format: boolean, relation: boolean, coverage: boolean, date_keyword: boolean, external_link: boolean,
     * alternate_external_link: boolean, type: boolean, thumbnail_url: string}}
     */
    private parseRawItem(raw_item, returnArrays = false){
        let item = {
            id: raw_item.id,
            title: raw_item.title_keyword[0],
            titles: raw_item.title_keyword,
            alternative_title: false,
            first_line: false,
            collection: raw_item.collectionName,
            institution: raw_item.institutionName,
            author: false,
            language: false,
            rights: false,
            source: false,
            description: false,
            identifier: false,
            decade: false,

            subject: false,
            publisher: false,
            contributor: false,
            date: false,
            format: false,
            relation: false,
            coverage: false,
            date_keyword: false,
            external_link: false,
            alternate_external_link: false,
            type: false,

            thumbnail_url: '/assets/img/no-thumb.png',
        };

        for(let ii in raw_item.titles){
            let title = raw_item.titles[ii];

            item = this.fillItemWithEndStringModificator(item, title, 'alternative_title', '[alternative title]');
            item = this.fillItemWithEndStringModificator(item, title, 'first_line', '[first line]');
        }

        if(typeof raw_item['thumbnail_url'] !== 'undefined'){
            item['thumbnail_url'] = raw_item['thumbnail_url'];
        }

        if(typeof raw_item['external_link'] !== 'undefined'){
            item['external_link'] = raw_item['external_link'];
        }

        // item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'collectionName', 'collection', 0, implodeArrays);
        // item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'institutionName', 'institution', 0, implodeArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'creator_keyword', 'author', 0, returnArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'language_keyword', 'language', 0, returnArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'rights_keyword', 'rights', 0, returnArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'source_keyword', 'source', 0, returnArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'description_keyword', 'description', 0, returnArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'identifier_keyword', 'identifier', 0, returnArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'decade', 'decade', 0, returnArrays);

        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'subject_keyword', 'subject', 0, returnArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'publisher_keyword', 'publisher', 0, returnArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'contributor_keyword', 'contributor', 0, returnArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'date_keyword', 'date', 0, true);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'alternate_external_link', 'alternate_external_link', 0, true);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'format_keyword', 'format', 0, returnArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'relation_keyword', 'relation', 0, returnArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'coverage_keyword', 'coverage', 0, returnArrays);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'type_keyword', 'type', 0, returnArrays);

        if(!returnArrays){
            item.decade = this.makeHumanReadableDate(item.decade);
        }

        return item;
    }

    /**
     * Sets Item Object Property with n element of array or sets all array
     * @param item {Object} Item - all information transformed to the object
     * @param raw_item {array} - info about item by
     * @param data_key {string} - Key in Raw item
     * @param item_key {string} - Property in Item Object
     * @param index {number} - first index in array
     * @param returnArray return value by index or all array
     * @returns {any}
     */
    private fillItemWithFirstOfArrayIfExists(item, raw_item, data_key, item_key, index = 0, returnArray = false){
        if(typeof raw_item[data_key] !== 'undefined'){
            if(typeof raw_item[data_key][index] !== 'undefined'){
                if(returnArray){
                    item[item_key] = raw_item[data_key];
                }else{
                    item[item_key] = raw_item[data_key][index];
                }
            }
        }

        return item;
    }

    /**
     * Returns facet human-readable name
     * @param name {string} - get name from solr
     * @returns {any}
     */
    private getFacetDisplayName(name){
        let new_name = '';
        let displayFilter = false;

        switch (name){
            case 'collectionName':
                new_name = 'Collections';
                displayFilter = true;
                break;
            case 'institutionName':
                new_name = 'Institutions';
                displayFilter = true;
                break;
            case 'type_keyword':
                new_name = 'Types';
                displayFilter = false;
                break;
            case 'creator_keyword':
                new_name = 'Authors';
                displayFilter = true;
                break;
            case 'decade':
                displayFilter = true;
                new_name = 'Decade';
                break;
        }

        if(displayFilter){
            return new_name;
        }

        return false;
    }

    /**
     * Sets item property to selected string if end of string contains specific text
     * @param item {Object} Item - all information transformed to the object
     * @param string {string} - text entered in input
     * @param property {string} - item property
     * @param endsWith {string} - end string modificator
     * @returns {any} item
     */
    private fillItemWithEndStringModificator(item, string, property, endsWith){
        if (string.endsWith(endsWith)) {
            if (!item[property]) {
                string = string.substring(0, endsWith.length);
                item[property] = string;
            }
        }

        return item;
    }

    /**
     * Returns Universities
     * @returns {Observable<R>}
     */
    public getUniversities(){
        let url =
            this.baseURL + 'select' + '?' +
            'q=*&' +
            'wt=jsonp&' +
            'sort=institutionName%20asc&' +
            'facet=true&' +
            'rows=0&' +
            'facet.field=institutionName&' +
            'json.wrf=JSONP_CALLBACK';

        return this._jsonp.get(url).map(data => {
            let universities = [];

            let raw_universities = data.json().facet_counts.facet_fields['institutionName'];

            let c = raw_universities.length;

            for(let i = 0; i < c; i=i+2){
                let count = raw_universities[i+1];

                if(count){
                    let name = decodeURI(raw_universities[i]);

                    universities.push({
                        name: name,
                        realName: raw_universities[i],
                        count: count,
                    });
                }
            }

            universities.sort(SolrService.dynamicSort('name'));

            return {
                universities: universities,
            };
        });
    }

    /**
     * Returns Prrla Members
     * @returns {Observable<R>}
     */
    public getPrrlaMembers(){
        let url =
            this.baseURL + 'select' +
            '?q=prrla_member_title:*' +
            '&rows=0' +
            '&wt=jsonp' +
            '&sort=prrla_member_title%20asc' +
            '&indent=true' +
            '&facet=true' +
            '&facet.field=prrla_member_title' +
            '&json.wrf=JSONP_CALLBACK';

        return this._jsonp.get(url).map(data => {
            let members = [];

            console.log(data.json());

            let raw_members = data.json().facet_counts.facet_fields['prrla_member_title'];

            let c = raw_members.length;

            for(let i = 0; i < c; i=i+2){
                let count = raw_members[i+1];

                if(count){
                    let name = decodeURI(raw_members[i]);

                    members.push({
                        name: name,
                        realName: raw_members[i],
                        count: count,
                    });
                }
            }

            return {
                members: members,
            };
        });
    }

    /**
     * Returns Collections
     * @returns {Observable<R>}
     */
    public getCollections(){
        let url =
            this.baseURL + 'select' + '?' +
            'q=*&' +
            'wt=jsonp&' +
            'facet=true&' +
            'rows=0&' +
            'facet.field=collectionName&' +
            'json.wrf=JSONP_CALLBACK';

        return this._jsonp.get(url).map(data => {
            let collections = [];

            let raw_collections = data.json().facet_counts.facet_fields['collectionName'];

            let c = raw_collections.length;

            for(let i = 0; i < c; i=i+2){
                let count = raw_collections[i+1];

                if(count){
                    let name = decodeURI(raw_collections[i]);

                    collections.push({
                        name: name,
                        realName: raw_collections[i],
                        count: count,
                    });
                }
            }

            collections.sort(SolrService.dynamicSort('name'));

            return {
                collections: collections,
            };
        });
    }

    /**
     * Returns Collections by University Name
     * @param universityName {string} - set university name
     * @returns {Observable<R>}
     */
    public getCollectionsByUniversity(universityName) {
        let url =
            this.baseURL + 'select' +
            '?q=institutionName:' + encodeURIComponent('"' + universityName + '"') +
            '&rows=' + (Math.pow(2,31) - 1) +
            '&facet=true' +
            '&facet.field=collectionName' +
            '&facet.sort=count' +
            '&facet.mincount=1' +
            '&facet.limit=-1' +
            // '&sort=collectionName%20asc' +
            '&wt=jsonp' +
            '&indent=true' +
            '&json.wrf=JSONP_CALLBACK';

        return this._jsonp.get(url).map(data => {
            let collections = [];

            let raw_collections = data.json().facet_counts.facet_fields['collectionName'];

            let c = raw_collections.length;

            for(let i = 0; i < c; i=i+2){
                let count = raw_collections[i+1];

                if(count){
                    let name = decodeURI(raw_collections[i]);

                    collections.push({
                        name: name,
                        realName: raw_collections[i],
                        count: count,
                    });
                }
            }

            collections.sort(SolrService.dynamicSort('name'));

            return {
                collections: collections,
            };
        });
    }

    /**
     * Returns Universities by Collection Name
     * @param collectionName {string} - set collection name
     * @returns {Observable<R>}
     */
    public getUniversitiesByCollection(collectionName){
        let url =
            this.baseURL + 'select' + '?' +
            'q=*&' +
            'wt=jsonp&' +
            'facet=true&' +
            'rows=0&' +
            'facet.field=institutionName&' +
            'json.wrf=JSONP_CALLBACK';

        url += '&fq=collectionName:"' + encodeURIComponent(collectionName) + '"';

        return this._jsonp.get(url).map(data => {
            let institutions = [];

            let raw_institutions = data.json().facet_counts.facet_fields['institutionName'];

            let c = raw_institutions.length;

            for(let i = 0; i < c; i=i+2){
                let count = raw_institutions[i+1];

                if(count){
                    let name = decodeURI(raw_institutions[i]);

                    institutions.push({
                        name: name,
                        realName: raw_institutions[i],
                        count: count,
                    });
                }
            }

            return {
                institutions: institutions,
            };
        });
    }

    /**
     * Get Prrla Member Info by Name
     * @param name {string} - member name
     * @returns {Observable<R>}
     */
    public getPrrlaMemberInfoByName(name){
        let url =
            this.baseURL + 'select' +
            '?q=prrla_member_title:' + '"' + encodeURIComponent(name) + '"' +
            '&wt=jsonp' +
            '&indent=true' +
            '&json.wrf=JSONP_CALLBACK';

        return this._jsonp.get(url).map(data => {
            let memberInfo = data.json().response.docs[0];

            return {
                memberInfo: memberInfo
            };
        });
    }

    /**
     * Sort array by property
     * @param property {string} - property name for sorting array
     * @returns {(a:any, b:any)=>number}
     */
    public static dynamicSort(property) {
        let sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
}
