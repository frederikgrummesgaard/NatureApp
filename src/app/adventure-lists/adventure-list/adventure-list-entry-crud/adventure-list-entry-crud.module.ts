import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { AdventureListEntryCrudRoutingModule } from "./adventure-list-entry-crud-routing.module";
import { AdventureListEntryCrudComponent } from "./adventure-list-entry-crud.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        AdventureListEntryCrudRoutingModule,
        ReactiveFormsModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        AdventureListEntryCrudComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AdventureListCrudModule { }
