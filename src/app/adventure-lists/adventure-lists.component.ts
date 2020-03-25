import { Component, OnDestroy, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { RouterExtensions } from "nativescript-angular/router";
import { ListViewEventData } from "nativescript-ui-listview";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import * as app from "tns-core-modules/application";
import { AdventureList } from "~/app/shared/models/adventureList.model";
import { AdventureListService } from "../shared/services/adventure-list.service";


@Component({
    selector: "AdventureLists",
    templateUrl: "./adventure-lists.component.html"
})
export class AdventureListsComponent implements OnInit, OnDestroy {
    private _isLoading: boolean = false;
    private _adventureLists: ObservableArray<AdventureList> = new ObservableArray<AdventureList>([]);
    private _dataSubscription: Subscription;

    constructor(
        private _adventureListService: AdventureListService,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {

        if (!this._dataSubscription) {
            this._isLoading = true;

            this._dataSubscription = this._adventureListService.load()
                .pipe(finalize(() => this._isLoading = false))
                .subscribe((adventureLists: Array<AdventureList>) => {
                    this._adventureLists = new ObservableArray(adventureLists);
                    this._isLoading = false;
                });
        }

    }

    ngOnDestroy(): void {
        if (this._dataSubscription) {
            this._dataSubscription.unsubscribe();
            this._dataSubscription = null;
        }
    }

    get adventureLists(): ObservableArray<AdventureList> {
        return this._adventureLists;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    onAdventureListItemTap(args: ListViewEventData): void {
        const tappedAdventureItem = args.view.bindingContext;

        this._routerExtensions.navigate(["/adventure-lists/adventure-list", tappedAdventureItem.id],
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
}
