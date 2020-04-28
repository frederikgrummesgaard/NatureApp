import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TermsRoutingModule } from "./terms-routing.module";
import { TermsComponent } from "./terms.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        TermsRoutingModule
    ],
    declarations: [
        TermsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class TermsModule { }
