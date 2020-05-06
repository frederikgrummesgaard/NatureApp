import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TaleCategoriesRoutingModule } from "./tale-categories-routing.module";
import { TaleCategoriesComponent } from "./tale-categories.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular/listview-directives";
import { TalesComponent } from "./tales/tales.component";
import { TaleComponent } from "./tales/tale/tale.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        TaleCategoriesRoutingModule,
        NativeScriptUIListViewModule,
    ],
    declarations: [
        TaleCategoriesComponent,
        TalesComponent,
        TaleComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class TaleCategoriesModule { }
