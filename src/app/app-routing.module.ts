import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", loadChildren: () => import("~/app/home/home.module").then((m) => m.HomeModule) },
    { path: "tales", loadChildren: () => import("~/app/tales/tales.module").then((m) => m.TalesModule) },
    { path: "adventure", loadChildren: () => import("~/app/adventure/adventure.module").then((m) => m.AdventureModule) },
    { path: "about", loadChildren: () => import("~/app/about/about.module").then((m) => m.AboutModule) },
    { path: "settings", loadChildren: () => import("~/app/settings/settings.module").then((m) => m.SettingsModule) }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
