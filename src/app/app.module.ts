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
import { registerElement } from "nativescript-angular/element-registry";
import * as application from "tns-core-modules/application";
const imageCache = require("nativescript-web-image-cache");
import { ExtendedShowModalOptions, ModalStack, overrideModalViewMethod } from "nativescript-windowed-modal"
import { SubscriptionModalComponent } from "./shared/subscription-modal/subscription-modal.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
overrideModalViewMethod();
registerElement("ModalStack", () => ModalStack);
registerElement("WebImage", () => require("nativescript-web-image-cache").WebImage);
if (application.android) {
    application.on(application.launchEvent, function (args) {
        imageCache.initialize();
    });
}
require("nativescript-plugin-firebase");

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptCommonModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule,
        NgShadowModule,

    ],
    declarations: [
        AppComponent,
        SubscriptionModalComponent
    ],
    entryComponents: [SubscriptionModalComponent],
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
