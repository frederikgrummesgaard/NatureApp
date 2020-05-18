import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { TaleCrudComponent } from "./tale-crud.component";

const routes: Routes = [
    { path: "", component: TaleCrudComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class TaleCrudRoutingModule { }
