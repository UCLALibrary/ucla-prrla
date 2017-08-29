import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {
    public static _showError = false;
    public static _title = 'General error';
    public static _message = 'Error occurred';

    constructor() {
    }

    ngOnInit() {
    }

    public static show(title, message) {
        this._showError = true;
        this._title = title;
        this._message = message;
    }

    public static showBackend(message = 'Problems with API. Try to reload page.'){
        this.show('Backend error', message);
    }

    get showError(){
        return ErrorComponent._showError;
    }

    get message(){
        return ErrorComponent._message;
    }

    get title(){
        return ErrorComponent._title;
    }
}
