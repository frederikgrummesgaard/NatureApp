import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AuthGuard } from "~/auth-guard.service";

export const authProviders = [
    AuthGuard
];
const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", loadChildren: () => import("~/app/home/home.module").then((m) => m.HomeModule), canActivate: [AuthGuard] },
    { path: "tale-categories", loadChildren: () => import("~/app/tale-categories/tale-categories.module").then((m) => m.TaleCategoriesModule) },
    { path: "adventure", loadChildren: () => import("~/app/adventure-lists/adventure-lists.module").then((m) => m.AdventureListsModule) },
    { path: "about", loadChildren: () => import("~/app/about/about.module").then((m) => m.AboutModule) },
    { path: "terms", loadChildren: () => import("~/app/terms/terms.module").then((m) => m.TermsModule) },
    { path: "login", loadChildren: () => import("~/app/login/login.module").then((m) => m.LoginModule) },
    { path: "profile", loadChildren: () => import("~/app/profile/profile.module").then((m) => m.ProfileModule) }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
