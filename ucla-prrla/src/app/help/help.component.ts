import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {

  goTo(location: string): void {
    window.location.hash = location;
  }

  constructor() {}

  ngOnInit() {
  }

}
