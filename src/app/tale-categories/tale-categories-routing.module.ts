import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { TaleCategoriesComponent } from "./tale-categories.component";
import { TalesComponent } from "./tales/tales.component";
import { TaleComponent } from "./tales/tale/tale.component";
import { TaleCrudComponent } from "./tales/tale-crud/tale-crud.component";

const routes: Routes = [
    { path: "", component: TaleCategoriesComponent },
    { path: "tales/:id", component: TalesComponent },
    { path: "tales/:id/tale/:id", component: TaleComponent },
    { path: "tales/:id/tale-crud", component: TaleCrudComponent },
    { path: "tales/:id/tale-crud/:id", component: TaleCrudComponent },

];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class TaleCategoriesRoutingModule { }
