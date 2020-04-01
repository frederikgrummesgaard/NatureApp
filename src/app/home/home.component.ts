import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { screen } from "tns-core-modules/platform";
import { Label } from 'tns-core-modules/ui/label';
import { isAndroid } from 'tns-core-modules/platform';
import { EventData } from "tns-core-modules/ui/page/page";



@Component({
    selector: "Home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
    public buttonHeight: string = screen.mainScreen.heightDIPs / 3 + "px";

    constructor(private routerExtensions: RouterExtensions) { }

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

    onLabelLoaded(args: EventData) {
        const lbl = args.object as Label;
        if (isAndroid) {
            lbl.android.setGravity(17)
        }
    }
}
