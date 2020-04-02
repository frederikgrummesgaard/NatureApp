import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AuthGuard } from "~/auth-guard.service";
import { AdventureListsComponent } from "./adventure-lists.component";
import { AdventureListComponent } from "./adventure-list/adventure-list.component";
import { AdventureEntryComponent } from "./adventure-list/adventure-entry/adventure-entry.component";

const routes: Routes = [
    { path: "", component: AdventureListsComponent },
    { path: "adventure-list/:id", component: AdventureListComponent, canActivate: [AuthGuard] },
    { path: "adventure-list/:id/adventure-entry/:id", component: AdventureEntryComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AdventureListsRoutingModule { }

