import { Component, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { RouterExtensions } from "nativescript-angular/router";
import { ListViewEventData } from "nativescript-ui-listview";

import { ObservableArray } from "tns-core-modules/data/observable-array";
import * as app from "tns-core-modules/application";
import { AdventureList } from "~/app/shared/models/adventureList.model";
import { AdventureListService } from "../shared/services/adventure-list.service";
import { UserService } from "../shared/services/user.service";
import { ExtendedShowModalOptions } from "nativescript-windowed-modal";
import { SubscriptionModalComponent } from "../shared/subscription-modal/subscription-modal.component";
import { ModalDialogService } from "nativescript-angular/common";

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
        private userService: UserService,
        private viewContainerRef: ViewContainerRef,
        private modalService: ModalDialogService
    ) {
        let date = new Date()
        if (this.userService.user) {
            this.userService.user.isAdmin ? this.isAdmin = true : this.isAdmin = false;
            if (this.isAdmin) {
                this.isSubscriber = true;
                this.userService.user.subscriptionEnds.setFullYear(2040, 1, 1);
            } else if (this.userService.user.subscriptionEnds) {
                this.userService.user.subscriptionEnds >= date ? this.isSubscriber = true : this.isSubscriber = false;
                if (this.userService.user.subscriptionEnds < date) {
                    this.userService.removeSubscriber();
                }
            }
        } else {
            this.isAdmin = false;
            this.isSubscriber = false;
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

    onSubscriptionModalButtonTap(): void {
        const options: any = {
            context: "",
            viewContainerRef: this.viewContainerRef,
            closeCallback: (response: string) => console.log("Modal response: " + response),
            fullscreen: false,
            dimAmount: 0.3,
            stretched: true,
        } as ExtendedShowModalOptions;
        this.modalService.showModal(SubscriptionModalComponent, options);
    }

    get adventureLists(): ObservableArray<AdventureList> {
        return this._adventureLists;
    }
}
