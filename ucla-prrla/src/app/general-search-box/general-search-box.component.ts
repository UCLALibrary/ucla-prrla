import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-general-search-box',
    templateUrl: './general-search-box.component.html'
})
export class GeneralSearchBoxComponent implements OnInit {
    public search;

    constructor(private router: Router) {
    }

    btnClick(therms: string) {
        this.doNavigation(therms);
    }

    onEnter(event: any) { // without type info
        this.doNavigation(event.currentTarget.value);
    }

    doNavigation(therms: string) {
        this.router.navigate(['/search'], {queryParams: {therms: therms}});
    }

    ngOnInit() {
    }

}
