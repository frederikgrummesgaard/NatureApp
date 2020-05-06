import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { TaleComponent } from "./tale/tale.component";
import { TalesRoutingModule } from "./tales-routing.module";



@NgModule({
    imports: [
        NativeScriptCommonModule,
        TalesRoutingModule
    ],
    declarations: [
        TaleComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class TaleModule { }
