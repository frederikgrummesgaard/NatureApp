import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { AdventureListsRoutingModule } from "./adventure-lists-routing.module";
import { AdventureListsComponent } from "./adventure-lists.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        AdventureListsRoutingModule
    ],
    declarations: [
        AdventureListsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AdventureListsModule { }
