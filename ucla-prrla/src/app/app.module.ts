import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { router, routes} from './app.router';
import {Ng2PaginationModule} from 'ng2-pagination'; //importing ng2-pagination
import {ShareModule} from 'ng2share/share.module' //social
import {HttpModule, JsonpModule} from '@angular/http';
import {AccordionModule} from 'ng2-accordion';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { IndexContentComponent } from './index-content/index-content.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { AboutComponent } from './about/about.component';
import { InstitutionsComponent } from './institutions/institutions.component';
import { CollectionsComponent } from './collections/collections.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { HelpComponent } from './help/help.component';
import { DetailItemComponent } from './detail-item/detail-item.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SolrService } from './services/solr.service';
import { ParseJsonPipe } from './parse-json/parse-json.pipe';
import { DerpPipe } from './derp.pipe';
import { UrlPipe } from './url.pipe';
import { ExhibitionsComponent } from './exhibitions/exhibitions.component';
import { GeneralSearchBoxComponent } from './general-search-box/general-search-box.component';
import {ExhibitionComponent} from './exhibition/exhibition.component';
import {InstitutionComponent} from './institution/institution.component';
import {ErrorComponent} from './error/error.component';
import {TruncatePipe} from './truncate.pipe';
import {ImplodePipe} from './implode.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    IndexContentComponent,
    HeaderMenuComponent,
    AboutComponent,
    InstitutionsComponent,
    CollectionsComponent,
    AdvancedSearchComponent,
    HelpComponent,
    DetailItemComponent,
    NotFoundComponent,
    ParseJsonPipe,
    DerpPipe,
    UrlPipe,
    ExhibitionsComponent,
    GeneralSearchBoxComponent,
    ExhibitionComponent,
    InstitutionComponent,
    ErrorComponent,
    TruncatePipe,
    ImplodePipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    ShareModule,
    routes,
    Ng2PaginationModule,
    HttpModule,
    JsonpModule,
    AccordionModule
  ],
  providers: [SolrService],
  bootstrap: [AppComponent]
})
export class AppModule { }
