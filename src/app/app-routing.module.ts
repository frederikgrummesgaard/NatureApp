import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AuthGuard } from "~/auth-guard.service";

export const authProviders = [
    AuthGuard
];
const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full", canActivate: [AuthGuard] },
    { path: "home", loadChildren: () => import("~/app/home/home.module").then((m) => m.HomeModule), canActivate: [AuthGuard] },
    { path: "tales", loadChildren: () => import("~/app/tales/tales.module").then((m) => m.TalesModule), canActivate: [AuthGuard] },
    { path: "adventure", loadChildren: () => import("~/app/adventure-lists/adventure-lists.module").then((m) => m.AdventureListsModule), canActivate: [AuthGuard] },
    { path: "about", loadChildren: () => import("~/app/about/about.module").then((m) => m.AboutModule), canActivate: [AuthGuard] },
    { path: "settings", loadChildren: () => import("~/app/settings/settings.module").then((m) => m.SettingsModule), canActivate: [AuthGuard] },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
