import { NgModule, NO_ERRORS_SCHEMA, ElementRef, Inject } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule, RadListViewComponent } from "nativescript-ui-listview/angular";

import { AdventureListsComponent } from "./adventure-lists.component";
import { AdventureListComponent } from "./adventure-list/adventure-list.component";
import { AdventureListsRoutingModule } from "./adventure-lists-routing.module";
import { AdventureEntryComponent } from "./adventure-list/adventure-entry/adventure-entry.component";
import { AdventureListCrudComponent } from "./adventure-list-crud/adventure-list-crud.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { AdventureListEntryCrudComponent } from "./adventure-list/adventure-list-entry-crud/adventure-list-entry-crud.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        AdventureListsRoutingModule,
        NativeScriptUIListViewModule,
        ReactiveFormsModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        AdventureListsComponent,
        AdventureListCrudComponent,
        AdventureListEntryCrudComponent,
        AdventureListComponent,
        AdventureEntryComponent,
    ],
    providers: [
        FormBuilder,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AdventureListsModule { }
