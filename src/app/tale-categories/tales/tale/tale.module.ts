import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TaleRoutingModule } from "./tale-routing.module";
import { TaleComponent } from "./tale.component";
import { CommonModule, DatePipe } from "@angular/common";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        TaleRoutingModule,
        CommonModule,
    ],
    declarations: [
        TaleComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [DatePipe,
    ]
})
export class TalesModule { }
