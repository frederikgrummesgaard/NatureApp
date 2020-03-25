import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { AdventureEntryComponent } from "./adventure-entry.component";

const routes: Routes = [
    { path: "", component: AdventureEntryComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AdventureEntryRoutingModule { }
