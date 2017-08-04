import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { IndexContentComponent } from './index-content/index-content.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { FooterHelpComponent } from './footer-help/footer-help.component';
import { FooterAboutComponent } from './footer-about/footer-about.component';
import { InstitutionsComponent } from './institutions/institutions.component';
import { CollectionsComponent } from './collections/collections.component';
import { ExhibitionsComponent } from './exhibitions/exhibitions.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { DetailItemComponent } from './detail-item/detail-item.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const router: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    // { path: '', component: IndexContentComponent },
    { path: 'index', component: IndexContentComponent },
    { path: 'institutions', component: InstitutionsComponent },
    { path: 'explore-collections', component: CollectionsComponent },
    { path: 'exhibitions', component: ExhibitionsComponent },
    { path: 'search', component: AdvancedSearchComponent },
    { path: 'help', component: HelpComponent },
    { path: 'about', component: AboutComponent },
    { path: 'footer-help', component: FooterHelpComponent },
    { path: 'footer-about', component: FooterAboutComponent },
    { path: 'detail/:id', component: DetailItemComponent },
    { path: '**', component: NotFoundComponent },
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
