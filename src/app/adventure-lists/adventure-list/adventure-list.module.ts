import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { AdventureListRoutingModule } from "./adventure-list-routing.module";
import { AdventureListComponent } from "./adventure-list.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        AdventureListRoutingModule
    ],
    declarations: [
        AdventureListComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AdventureListModule { }
