import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AdventureListsComponent } from "./adventure-lists.component";
import { AdventureListComponent } from "./adventure-list/adventure-list.component";
import { AdventureEntryComponent } from "./adventure-list/adventure-entry/adventure-entry.component";
import { AdventureListCrudComponent } from "./adventure-list-crud/adventure-list-crud.component";

const routes: Routes = [
    { path: "", component: AdventureListsComponent },
    { path: "adventure-list/:id", component: AdventureListComponent, },
    { path: "adventure-list/:id/adventure-entry/:id", component: AdventureEntryComponent, },
    { path: "adventure-list-crud", component: AdventureListCrudComponent, }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AdventureListsRoutingModule { }

