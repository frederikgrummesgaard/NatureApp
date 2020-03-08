import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { AdventureRoutingModule } from "./adventure-routing.module";
import { AdventureComponent } from "./adventure.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        AdventureRoutingModule
    ],
    declarations: [
        AdventureComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AdventureModule { }
