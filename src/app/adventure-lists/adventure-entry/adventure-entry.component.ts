import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { AdventureEntry } from "~/models/adventureEntry.model";

@Component({
    selector: "Adventures",
    templateUrl: "./adventureEntry.component.html"
})
export class AdventureEntryComponent implements OnInit {

    public adventureEntry: AdventureEntry;

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
