import { Component, OnInit } from "@angular/core";
import { AdventureEntry } from "~/app/shared/models/adventureEntry.model";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "Adventures",
    templateUrl: "./adventureEntry.component.html"
})
export class AdventureEntryComponent implements OnInit {

    public adventureEntry: AdventureEntry;

    constructor(private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();
    }
}
