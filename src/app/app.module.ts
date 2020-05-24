import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NgShadowModule } from 'nativescript-ng-shadow';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AdventureListService } from "./shared/services/adventure-list.service";
import { UserService } from "./shared/services/user.service";
import { AuthGuard } from "~/auth-guard.service";
import { TaleService } from "./shared/services/tale.service";
import { UtilityService } from "./shared/services/utility.service";


require("nativescript-plugin-firebase");

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule,
        NgShadowModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AdventureListService,
        TaleService,
        UserService,
        UtilityService,
        AuthGuard,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
