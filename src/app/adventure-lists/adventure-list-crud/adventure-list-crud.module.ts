import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { AdventureListCrudRoutingModule } from "./adventure-list-crud-routing.module";
import { AdventureListCrudComponent } from "./adventure-list-crud.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        AdventureListCrudRoutingModule,
    ],
    declarations: [
        AdventureListCrudComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AdventureListCrudModule { }
