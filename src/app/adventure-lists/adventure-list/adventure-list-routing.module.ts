import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { AdventureListComponent } from "./adventure-list.component";

const routes: Routes = [
    { path: "", component: AdventureListComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AdventureListRoutingModule { }
