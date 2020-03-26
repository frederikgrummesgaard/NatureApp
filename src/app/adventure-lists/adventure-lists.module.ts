import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

import { AdventureListsRoutingModule } from "./adventure-lists-routing.module";
import { AdventureListsComponent } from "./adventure-lists.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        AdventureListsRoutingModule,
        NativeScriptUIListViewModule
    ],
    declarations: [
        AdventureListsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AdventureListsModule { }
