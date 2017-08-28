import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Jsonp} from '@angular/http';

@Injectable()

export class TestService {
    private baseURL = 'http://test-solr.library.ucla.edu/solr/prrla/';
    public pageSize = 10;
    public orderBy = '';
    public availableOrders = [
        { value: '', name: 'Relevance'},
        { value: 'first_title asc', name: 'Title (a-z)'},
        { value: 'first_title desc', name: 'Title (z-a)'},
        { value: 'sort_decade asc', name: 'Date (oldest first)'},
        { value: 'sort_decade desc', name: 'Date (newest first)'}
    ];

    constructor(private _jsonp: Jsonp) {

    }

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

    public getPaginatedBooks(search, filters, page = 1) {
        if(search == ''){
            search = '*';
        }

        let offset = (page - 1) * this.pageSize;
        let url =
            this.baseURL + 'select' + '?' +
            'q=' + encodeURI(search) + '&' +
            'rows=' + this.pageSize + '&' +
            'start=' + offset + '&' +
            'wt=json&' +
            'sort=' + encodeURI(this.orderBy) + '&' +
            'facet=true&' +
            'facet.field=institutionName&' +
            'facet.field=collectionName&' +
            'facet.field=type_keyword&' +
            'facet.field=creator_keyword&' +
            'facet.field=decade&' +
            'facet.field=language_keyword&' +
            'facet.field=rights_keyword&' +
            'facet.field=collection&' +
            'facet.field=source_keyword&' +
            'facet.field=description_keyword&' +
            'facet.field=identifier_keyword&' +
            'json.wrf=JSONP_CALLBACK';

        for(let filterName in filters){
            for(let filterVal in filters[filterName]){
                filterVal = filters[filterName][filterVal];
                url += '&fq=' + filterName + ':"' + encodeURIComponent(filterVal) + '"';
            }
        }

        return this._jsonp.get(url).map(data => {
            console.log(data.json());

            let totalRecords = data.json().response.numFound;
            let raw_items = data.json().response.docs;
            let items = [];

            for(let i in raw_items){
                let raw_item = raw_items[i];

                let item = this.parseRawItem(raw_item);

                items.push(item);
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
                            filterItems.push({
                                name: decodeURI(facets[facet_name][i]),
                                count: count,
                            });
                        }
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

    public getItemById(id){
        let url =
            this.baseURL + 'select' + '?' +
            'q=' + encodeURI('id:' + id) + '&' +
            'indent=true&' +
            'wt=json&' +
            'json.wrf=JSONP_CALLBACK';

        return this._jsonp.get(url).map(data => {
            let raw_items = data.json().response.docs;

            if(raw_items.length == 1){
                return this.parseRawItem(raw_items[0]);
            }else{
                return false;
            }
        });
    }

    private parseRawItem(raw_item){
        let item = {
            id: raw_item.id,
            title: raw_item.title_keyword[0],
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
        };

        for(let ii in raw_item.titles){
            let title = raw_item.titles[ii];

            item = this.fillItemWithEndStringModificator(item, title, 'alternative_title', '[alternative title]');
            item = this.fillItemWithEndStringModificator(item, title, 'first_line', '[first line]');
        }

        // item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'collectionName', 'collection');
        // item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'institutionName', 'institution');
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'creator_keyword', 'author');
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'language_keyword', 'language');
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'rights_keyword', 'rights');
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'source_keyword', 'source');
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'description_keyword', 'description');
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'identifier_keyword', 'identifier', 1);
        item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'decade', 'decade');

        return item;
    }

    private fillItemWithFirstOfArrayIfExists(item, raw_item, data_key, item_key, index = 0){
        if(typeof raw_item[data_key] !== 'undefined'){
            if(typeof raw_item[data_key][index] !== 'undefined'){
                item[item_key] = raw_item[data_key][index];
            }
        }

        return item;
    }

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
                displayFilter = true;
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

    private fillItemWithEndStringModificator(item, string, property, endsWith){
        if(string.endsWith(endsWith)){
            if(!item[property]){
                string = string.substring(0, endsWith.length);
                item[property] = string;
            }
        }

        return item;
    }

    public getUniversities(){
        let url =
            this.baseURL + 'select' + '?' +
            'q=*&' +
            'wt=json&' +
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

            return {
                universities: universities,
            };
        });
    }

    public getPrrlaMembers(){
        let url =
            this.baseURL + 'select' +
            '?q=prrla_member_title:*' +
            '&rows=0' +
            '&wt=json' +
            '&indent=true' +
            '&facet=true' +
            '&facet.field=prrla_member_title' +
            '&json.wrf=JSONP_CALLBACK';

        return this._jsonp.get(url).map(data => {
            let members = [];

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

    public getCollections(){
        let url =
            this.baseURL + 'select' + '?' +
            'q=*&' +
            'wt=json&' +
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

            return {
                collections: collections,
            };
        });
    }

    public getCollectionsByUniversity(universityName){
        let url =
            // this.baseURL + 'select' + '?' +
            // 'q=*&' +
            // 'wt=json&' +
            // 'facet=true&' +
            // 'rows=0&' +
            // 'facet.field=collectionName&' +
            // 'json.wrf=JSONP_CALLBACK';

            this.baseURL + 'select' +
            '?q=institutionName:"' + encodeURIComponent(universityName) + '"' +
            '&rows=-1' +
            '&facet=true' +
            '&facet.field=collectionName' +
            '&facet.sort=count' +
            '&facet.mincount=1' +
            '&facet.limit=-1' +
            '&wt=json' +
            '&indent=true' +
            '&json.wrf=JSONP_CALLBACK';

        // url += '&fq=institutionName:"' + encodeURIComponent(universityName) + '"';

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

            return {
                collections: collections,
            };
        });
    }

    public getUniversitiesByCollection(collectionName){
        let url =
            this.baseURL + 'select' + '?' +
            'q=*&' +
            'wt=json&' +
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

    public getPrrlaMemberInfoByName(name){
        let url =
            this.baseURL + 'select' +
            '?q=prrla_member_title:"' + encodeURIComponent(name) + '"' +
            '&wt=json' +
            '&indent=true' +
            '&json.wrf=JSONP_CALLBACK';

        return this._jsonp.get(url).map(data => {
            let memberInfo = data.json().response.docs[0];

            return {
                memberInfo: memberInfo
            };
        });
    }
}
