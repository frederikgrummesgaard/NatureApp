import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { AdventureList } from "~/app/models/adventureList.model";

@Component({
    selector: "Adventures",
    templateUrl: "./adventureLists.component.html"
})
export class AdventureListsComponent implements OnInit {

    public adventureList: AdventureList;

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
