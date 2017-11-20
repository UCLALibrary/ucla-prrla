#### A developer would like to change the structure/html of an existing page or edit existing features
- At first you need to locate required file
- You should open `src/app.router.ts`
- Then you need to compare url and path
- For example `/` will be `index`, `/institution?name=Stanford University` will be `institution`
- Take a look at  row with your path part: `{ path: 'institution', component: InstitutionComponent }`
- `InstitutionComponent` - this will be your component, then you can locate it in `src/institution` directory
- There are two files in directory: `html` - ui and `ts` - logic

#### A developer would like to add a brand new page
- we need to add page with name `new`
- in the ng-cli console create new component with name `new` (`ng generate component [name]`)
- then define route for NewComponent
- open `app.router.ts` add statement to Routes: `{ path: 'new', component: NewComponent },`
- and the last thing to do will be edit the html file to put there your new content
- OR
- copy about page component with html and ts to new directory for example `new`
- rename `new/about.component.html` and `new/about.component.ts` to `new/new.component.html` and `new/new.component.ts`
- open ts file and change @Component() to be like this 
    `@Component({
        selector: 'app-new',
        templateUrl: './new.component.html'
      })`
- also rename AboutComponent to NewComponent
- then open `app.module.ts` and add following line at import section: `import { NewComponent } from './new/new.component';`
- find `@NgModule declarations` and add the line: `NewComponent,`
- then define route for NewComponent
- open `app.router.ts` add statement to Routes: `{ path: 'new', component: NewComponent },`
- and the last thing to do will be edit the html file to put there your new content

#### The Solr schema has changed, and there is a a new field, a field has been renamed, or the data structure behind a field has changed (for example, a string to a multivalue/array field), what is the most efficient way to identify and update the pages to reflect these changes
All Solr-related logic is located in `src/services/test.service.ts`.
The main method is `parseRawItem` in accepts raw item and returns object with fields for UI.
In case you need to add some field you should update this method and related view files.

Also if we have array for some field there is another method for this `fillItemWithFirstOfArrayIfExists`.
It is used to get first element of array for preview and to return all items at item page.
You should use it like this `item = this.fillItemWithFirstOfArrayIfExists(item, raw_item, 'source_keyword', 'source', 0, returnArrays);`

So if you need to add a new field just add the default statement for the field in parseRawItem method:

``let item = {
    ...
    new_field: false,
    ...
}``

Then if field is in array use fillItemWithFirstOfArrayIfExists method.
`item = fillItemWithFirstOfArrayIfExists(item, raw_item, 'filed_name_in_solr_response', 'new_field', index_of_array_for_preview, returnArrays);`
item, raw_item, returnArrays - are system variables.

If field is not array - just set it:
`if(typeof raw_item['new_field'] !== 'undefined') item.new_field = raw_item['filed_name_in_solr_response'];`

#### we need to change the the value for a field that displays in the search results
Just refer the previous question

#### we need to update or change the script for the dynamically generated pages, eg Institution page, and browse by collection title/ institution page.
Please refer previous questions

#### we need to add a banner that displays on all pages
You can modify every template page needed or modify `header.component.html`

#### we need to change the font/size or link treatment on pages
You can do this by changing style files located: `app/styles.css`

#### we want to add a new or change an existing search filter
Just add new facet in Solr response. Filter will appear automatically.

#### we want to make edits to the parameters of the social media share features the urls of the items pages are really long, we'd like to explore other ways of forming those, so we need to understand what you are doing now - eg. http://prl.library.ucla.edu/detail/oai:ira.lib.polyu.edu.hk:10397%2F3036?s_page=1&s_filters=%7B%7D&s_therms=&s_order=
