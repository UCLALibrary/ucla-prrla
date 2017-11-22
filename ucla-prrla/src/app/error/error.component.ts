import {Component, OnInit} from '@angular/core';

/**
 * This file is used to show misc errors
 */
@Component({
    selector: 'app-error',
    templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {
    /**
     * Boolean property defines show error or no
     * @type {boolean}
     * @private
     */
    public static _showError = false;

    /**
     * Error Title
     * @type {string}
     * @private
     */
    public static _title = 'General error';

    /**
     * Error Message
     * @type {string}
     * @private
     */
    public static _message = 'Error occurred';

    /**
     * Constructor
     */
    constructor() {
    }

    /**
     * OnInit
     */
    ngOnInit() {
    }

    /**
     * Call this method to show error
     * @param title
     * @param message
     */
    public static show(title, message) {
        this._showError = true;
        this._title = title;
        this._message = message;
    }

    /**
     * Predefined error in case of problems with backend
     * @param message
     */
    public static showBackend(message = 'Problems with API. Try to reload page.'){
        this.show('Backend error', message);
    }

    /**
     * returns showError property
     * @returns {boolean}
     */
    get showError(){
        return ErrorComponent._showError;
    }

    /**
     * returns Error Message
     * @returns {string}
     */
    get message(){
        return ErrorComponent._message;
    }

    /**
     * returns Error Title
     * @returns {string}
     */
    get title(){
        return ErrorComponent._title;
    }
}
