import { Component, OnInit } from '@angular/core';
import {TestService} from "../services/test.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorComponent} from "../error/error.component";

@Component({
  selector: 'app-exhibitions',
  templateUrl: './exhibitions.component.html'
})

export class ExhibitionsComponent implements OnInit {
  public collections = [
  ];

  constructor(private testService: TestService, private route: ActivatedRoute, private router: Router) {}


  ngOnInit() {
      this.testService.getCollections().subscribe(data => {
          this.collections = data.collections;
      }, error => {
          ErrorComponent.showBackend();
      });
  }

  clickOnViewCollection(realName){
      this.router.navigate(['/exhibition'], {
          queryParams: {
              name: realName
          }
      });
  }

}
