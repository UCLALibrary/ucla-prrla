import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { router, routes} from './app.router';


import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { CollectionsComponent } from './collections/collections.component';
import { DetailItemComponent } from './detail-item/detail-item.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { IndexContentComponent } from './index-content/index-content.component';
import { InstitutionsComponent } from './institutions/institutions.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    AboutComponent,
    HelpComponent,
    AdvancedSearchComponent,
    CollectionsComponent,
    DetailItemComponent,
    NotFoundComponent,
    IndexContentComponent,
    InstitutionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
