import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { AdventureListEntryCrudComponent } from "./adventure-list-entry-crud.component";

const routes: Routes = [
    { path: "", component: AdventureListEntryCrudComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AdventureListEntryCrudRoutingModule { }
