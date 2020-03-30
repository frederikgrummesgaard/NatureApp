import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { AdventureListRoutingModule } from "./adventure-list-routing.module";
import { AdventureListComponent } from "./adventure-list.component";
import { AdventureEntryComponent } from "./adventure-entry/adventure-entry.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        AdventureListRoutingModule
    ],
    declarations: [
        AdventureListComponent,
        AdventureEntryComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AdventureListModule { }
