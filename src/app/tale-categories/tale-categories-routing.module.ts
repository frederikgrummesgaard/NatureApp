import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { TaleCategoriesComponent } from "./tale-categories.component";
import { TalesComponent } from "./tales/tales.component";
import { TaleComponent } from "./tales/tale/tale.component";

const routes: Routes = [
    { path: "", component: TaleCategoriesComponent },
    { path: "tales/:id", component: TalesComponent },
    { path: "tales/:id/tale/:id", component: TaleComponent },

];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class TaleCategoriesRoutingModule { }
