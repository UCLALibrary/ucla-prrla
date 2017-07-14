import {Component, OnInit} from '@angular/core';
import {TestService} from "../services/test.service";
import {ActivatedRoute} from "@angular/router";
import {element} from "protractor";

@Component({
    templateUrl: './test.component.html'
})

export class TestComponent implements OnInit {
    public items = [];
    public itemFilters;
    public pager;

    public selectedFilters = {};

    public search_therms = '';

    constructor(private testService: TestService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.pager = this.testService.getPager(0);
        this.setPage(1);
    }

    setPage(page: number) {
        document.getElementById('loading').style.display = 'block';
        this.testService.getPaginatedBooks(this.search_therms, this.selectedFilters, page).subscribe(data => {
            this.items = data.items;
            this.pager = this.testService.getPager(data.totalItems, page);
            this.itemFilters = data.itemFilters;
            document.getElementById('loading').style.display = 'none';
        });
    }

    toggleActiveClass(event) {
        event.target.classList.toggle('active');
    }

    pagerClick(event, page) {
        if(!event.target.parentElement.classList.contains('disabled')){
            this.setPage(page);
        }
    }

    searchOnEnter(event) {
        this.search_therms = event.target.value;
        this.setPage(1);
    }

    clickOnFilter(event) {
        let filterName = event.target.name;
        let filterValue = event.target.value;
        let checked = event.target.checked;

        if(typeof this.selectedFilters[filterName] === 'undefined'){
            this.selectedFilters[filterName] = [];
        }

        let index = this.selectedFilters[filterName].indexOf(filterValue);

        if(checked){
            if(index === -1){
                this.selectedFilters[filterName].push(filterValue);
            }
        }else{
            if(index > -1){
                this.selectedFilters[filterName].splice(index, 1);
            }
        }

        if(this.selectedFilters[filterName].length == 0){
            delete this.selectedFilters[filterName];
        }

        this.setPage(1);
    }

    getIsSelectedFilter(filterName, filterVal){
        if(typeof this.selectedFilters[filterName] === 'undefined'){
            return false;
        }

        if(this.selectedFilters[filterName].indexOf(filterVal) === -1){
            return false;
        }

        return true;
    }

    getIsSelectedFilterChecked(filterName, filterVal){
        if(this.getIsSelectedFilter(filterName, filterVal)){
            return 'checked';
        }else{
            return '';
        }
    }
}