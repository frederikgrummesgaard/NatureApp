import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Tale } from "~/app/shared/models/tale.model";

@Component({
    selector: "Tales",
    templateUrl: "./tales.component.html"
})
export class TalesComponent implements OnInit {

    public tale: Tale;

    constructor() { }

    ngOnInit(): void {

    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
