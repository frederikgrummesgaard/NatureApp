import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { AdventureEntryRoutingModule } from "./adventure-entry-routing.module";
import { AdventureEntryComponent } from "./adventure-entry.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        AdventureEntryRoutingModule
    ],
    declarations: [
        AdventureEntryComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AdventureEntryModule { }
