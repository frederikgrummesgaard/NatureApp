import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TaleCategoriesRoutingModule } from "./tale-categories-routing.module";
import { TaleCategoriesComponent } from "./tale-categories.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular/listview-directives";
import { TalesComponent } from "./tales/tales.component";
import { TaleComponent } from "./tales/tale/tale.component";
import { DatePipe } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { TaleCrudComponent } from "./tales/tale-crud/tale-crud.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        TaleCategoriesRoutingModule,
        NativeScriptUIListViewModule,
        ReactiveFormsModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        TaleCategoriesComponent,
        TalesComponent,
        TaleComponent,
        TaleCrudComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        DatePipe,
        FormBuilder,
    ]
})
export class TaleCategoriesModule { }
