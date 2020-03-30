import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

import { AdventureListsComponent } from "./adventure-lists.component";
import { AdventureListComponent } from "./adventure-list/adventure-list.component";
import { AdventureListsRoutingModule } from "./adventure-lists-routing.module";
import { AdventureEntryComponent } from "./adventure-list/adventure-entry/adventure-entry.component";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        AdventureListsRoutingModule,
        NativeScriptUIListViewModule
    ],
    declarations: [
        AdventureListsComponent,
        AdventureListComponent,
        AdventureEntryComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AdventureListsModule { }
