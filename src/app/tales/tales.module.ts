import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TalesRoutingModule } from "./tales-routing.module";
import { TalesComponent } from "./tales.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        TalesRoutingModule
    ],
    declarations: [
        TalesComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class TalesModule { }
