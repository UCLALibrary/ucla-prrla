import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexContentComponent } from './index-content/index-content.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { InstitutionsComponent } from './institutions/institutions.component';
import { CollectionsComponent } from './collections/collections.component';
import { ExhibitionsComponent } from './exhibitions/exhibitions.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { DetailItemComponent } from './detail-item/detail-item.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ExhibitionComponent } from './exhibition/exhibition.component';
import {InstitutionComponent} from './institution/institution.component';

export const router: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: IndexContentComponent },
    { path: 'institutions', component: InstitutionsComponent },
    { path: 'explore-collections', component: CollectionsComponent },
    { path: 'exhibitions', component: ExhibitionsComponent },
    { path: 'search', component: AdvancedSearchComponent },
    { path: 'help', component: HelpComponent },
    { path: 'about', component: AboutComponent },
    { path: 'detail/:id', component: DetailItemComponent },
    { path: 'exhibition', component: ExhibitionComponent },
    { path: 'institution', component: InstitutionComponent },
    { path: '**', component: NotFoundComponent },
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);