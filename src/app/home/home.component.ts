import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { screen } from "tns-core-modules/platform";
import { Label } from 'tns-core-modules/ui/label';
import { isAndroid } from 'tns-core-modules/platform';
import { EventData } from "tns-core-modules/ui/page/page";
import { UserService } from "../shared/services/user.service";



@Component({
    selector: "Home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

    constructor(private routerExtensions: RouterExtensions,
        private userService: UserService) { }

    ngOnInit(): void {
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onTapNavigate(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });
    }

    logout() {
        this.routerExtensions.navigate(["/login"], {
            transition: {
                name: "fade"
            }
        });
        this.userService.logout();
    }

    onLabelLoaded(args: EventData) {
        const lbl = args.object as Label;
        if (isAndroid) {
            lbl.android.setGravity(17)
        }
    }
}
