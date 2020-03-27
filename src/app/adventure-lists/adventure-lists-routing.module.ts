import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { AdventureListsComponent } from "./adventure-lists.component";
import { AdventureListComponent } from "./adventure-list/adventure-list.component";

const routes: Routes = [
    { path: "", component: AdventureListsComponent },
    { path: "adventure-list/:id", component: AdventureListComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AdventureListsRoutingModule { }
