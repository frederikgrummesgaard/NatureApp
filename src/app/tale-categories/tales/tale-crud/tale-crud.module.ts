import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TaleCrudRoutingModule } from "./tale-crud-routing.module";
import { TaleCrudComponent } from "./tale-crud.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        TaleCrudRoutingModule,
    ],
    declarations: [
        TaleCrudComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class TaleCrudModule { }
