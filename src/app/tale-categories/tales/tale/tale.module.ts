import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TaleRoutingModule } from "./tale-routing.module";
import { TaleComponent } from "./tale.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular/listview-directives";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        TaleRoutingModule,
        NativeScriptUIListViewModule,
    ],
    declarations: [
        TaleComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class TalesModule { }
