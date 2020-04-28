import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { AdventureListCrudComponent } from "./adventure-list-crud.component";

const routes: Routes = [
    { path: "", component: AdventureListCrudComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AdventureListCrudRoutingModule { }
