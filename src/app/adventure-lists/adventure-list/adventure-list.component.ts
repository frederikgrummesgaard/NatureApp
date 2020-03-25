import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { AdventureList } from "~/app/shared/models/adventureList.model";

@Component({
    selector: "AdventuresList",
    templateUrl: "./adventure-list.component.html"
})
export class AdventureListComponent implements OnInit {

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
