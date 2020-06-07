import { Component, OnDestroy, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { RouterExtensions } from "nativescript-angular/router";
import { ListViewEventData } from "nativescript-ui-listview";

import { ObservableArray } from "tns-core-modules/data/observable-array";
import * as app from "tns-core-modules/application";
import { AdventureList } from "~/app/shared/models/adventureList.model";
import { AdventureListService } from "../shared/services/adventure-list.service";
import { UserService } from "../shared/services/user.service";

@Component({
    selector: "AdventureLists",
    templateUrl: "./adventure-lists.component.html",
    styleUrls: ["./adventure-lists.component.scss"]
})
export class AdventureListsComponent implements OnInit {
    public isLoading: boolean = false;
    public isAdmin: boolean;
    public isSubscriber: boolean;
    private _adventureLists: ObservableArray<AdventureList> = new ObservableArray<AdventureList>([]);

    constructor(
        private adventureListService: AdventureListService,
        private routerExtensions: RouterExtensions,
        private userService: UserService
    ) {
        if (this.userService.user) {
            this.userService.user.isAdmin ? this.isAdmin = true : this.isAdmin = false;
            this.userService.user.isSubscriber ? this.isSubscriber = true : this.isSubscriber = false;
        } else {
            this.isAdmin = false;
            this.isSubscriber = false;
        }
        if (!this.isSubscriber) {
            this.userService.initializeInAppPayments();
        }
    }

    ngOnInit(): void {
        this.loadAdventureLists();
    }

    loadAdventureLists() {
        this.isLoading = true;
        this.adventureListService.getAdventureLists().then(adventureListsDB => {
            const myList = <any>adventureListsDB;
            if (this.isSubscriber) {
                myList.forEach((adventureListEntry: AdventureList) => {
                    this._adventureLists.push(adventureListEntry);
                });
                this._adventureLists.sort((list1: AdventureList, list2: AdventureList) => {
                    return list1.difficulty >= list2.difficulty ? 1 : -1
                })
            } else {
                const adventureList = <any>adventureListsDB;
                this._adventureLists.push(adventureList);
            }
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
        const sideDrawer = <RadSideDrawer><unknown>app.getRootView();
        sideDrawer.showDrawer();
    }

    onCreateButtonTap(): void {
        if (this.isAdmin) {
            this.routerExtensions.navigate(["/adventure/adventure-list-crud"],
                {
                    animated: true,
                    transition: {
                        name: "slide",
                        duration: 200,
                        curve: "ease"
                    }
                });
        }
    }

    onSubscriptionButtonTap(): void {
        this.userService.buySubscription();
    }

    get adventureLists(): ObservableArray<AdventureList> {
        return this._adventureLists;
    }
}
