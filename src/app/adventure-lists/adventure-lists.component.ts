import { Component, OnDestroy, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { RouterExtensions } from "nativescript-angular/router";
import { ListViewEventData } from "nativescript-ui-listview";

import { ObservableArray } from "tns-core-modules/data/observable-array";
import * as app from "tns-core-modules/application";
import { AdventureList } from "~/app/shared/models/adventureList.model";
import { AdventureListService } from "../shared/services/adventure-list.service";


@Component({
    selector: "AdventureLists",
    templateUrl: "./adventure-lists.component.html",
    styleUrls: ["./adventure-lists.component.scss"]
})
export class AdventureListsComponent implements OnInit {
    isLoading: boolean = false;
    private _adventureLists: ObservableArray<AdventureList> = new ObservableArray<AdventureList>([]);

    constructor(
        private adventureListService: AdventureListService,
        private routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {
        this.loadAdventureLists();
    }

    loadAdventureLists() {
        this.isLoading = true;
        this.adventureListService.getAdventureLists().then(adventureListsDB => {
            const myList = <any>adventureListsDB;
            myList.forEach((adventureListEntry: AdventureList) => {
                this._adventureLists.push(adventureListEntry);
            });
            this.isLoading = false;
        });
    }

    onAdventureListItemTap(args: ListViewEventData): void {
        const tappedAdventureItem = args.view.bindingContext;

        this.routerExtensions.navigate(["/adventure/adventure-list", tappedAdventureItem.id],
            {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    get adventureLists(): ObservableArray<AdventureList> {
        return this._adventureLists;
    }
}
