import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {

  public navIsFixed: boolean = false;

  goTo(location: string): void {
    window.location.hash = location;
  }

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > 280) {
      this.navIsFixed = true;
    } else if (this.navIsFixed && number < 280) {
      this.navIsFixed = false;
    }
  }
}
