import { Component, OnInit, OnDestroy } from "@angular/core";
import { AdventureList } from "~/app/shared/models/adventureList.model";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { AdventureListService } from "~/app/shared/services/adventure-list.service";
import { switchMap } from "rxjs/operators";
import { AdventureEntry } from "~/app/shared/models/adventureEntry.model";
import { ListViewEventData } from "nativescript-ui-listview";
import { Location } from '@angular/common';
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { SnackBar } from "@nstudio/nativescript-snackbar";
import { UserService } from "~/app/shared/services/user.service";

@Component({
    selector: "AdventuresList",
    templateUrl: "./adventure-list.component.html",
    styleUrls: ["./adventure-list.component.scss"]

})
export class AdventureListComponent implements OnInit, OnDestroy {
    public isLoading: boolean = false;
    public adventureList: AdventureList;
    public adventureEntries$: ObservableArray<AdventureEntry[]>;
    public adventureListId: string;
    public locationSubscription: any;
    public isAdmin: boolean = false;

    constructor(private routerExtensions: RouterExtensions,
        private adventureListService: AdventureListService,
        private pageRoute: PageRoute,
        private userService: UserService,
        private location: Location) {
        if (this.userService.user.isAdmin) {
            this.isAdmin = true;
        }
    }

    ngOnInit(): void {
        this.loadingAdventureList();

        const snackbar = new SnackBar();

        // This subscription updates the AdventureEntries, when the back button 
        // is pressed in the adventure-entry-component 
        this.locationSubscription = this.location.subscribe(() => {
            this.adventureListService.getAdventureListEntries(this.adventureListId).then(
                (adventureListEntries: any) => {
                    this.adventureEntries$ = adventureListEntries;
                    this.isAdventureListCompleted(adventureListEntries, snackbar);
                }
            )
        });
    }

    ngOnDestroy(): void {
        this.locationSubscription.unsubscribe();
    }

    loadingAdventureList() {
        this.isLoading = true;
        this.pageRoute.activatedRoute
            .pipe(switchMap((activatedRoute) => activatedRoute.params))
            .forEach((params) => {
                this.adventureListId = params.id;
                this.adventureListService.getAdventureList(this.adventureListId).then(
                    (adventureList: AdventureList) => {
                        this.adventureList = adventureList;
                    });
                this.adventureListService.getAdventureListEntries(this.adventureListId).then(
                    (adventureListEntries: any) => {
                        this.adventureEntries$ = adventureListEntries;
                        this.isLoading = false;
                    }
                )
            });
    }

    onAdventureEntryItemTap(args: ListViewEventData): void {
        const tappedAdventureItem = args.view.bindingContext;
        this.routerExtensions.navigate(["/adventure/adventure-list/"
            + this.adventureListId + "/adventure-entry", tappedAdventureItem.id],
            {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
    }

    onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();
    }

    onEditButtonTap(): void {
        if (this.isAdmin) {
            this.routerExtensions.navigate(["/adventure/adventure-list-crud", this.adventureListId],
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

    onCreateAdventureEntry(): void {
        if (this.isAdmin) {
            this.routerExtensions.navigate(["/adventure/adventure-list/" + this.adventureListId
                + "/adventure-list-entry-crud"],
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

    /**
     * This method checks the entries and if all are completed, it updates the adventureList
     * and displays a snackbar congratulating the user
     */
    private isAdventureListCompleted(adventureListEntries: any, snackbar: SnackBar) {
        this.adventureList.isCompleted = true;
        adventureListEntries.forEach((entry: AdventureEntry) => {
            if (!entry.isDiscovered) {
                this.adventureList.isCompleted = false;
            }
        });
        if (this.adventureList.isCompleted) {
            this.adventureListService.updateAdventureList(this.adventureListId, { isCompleted: true });
            snackbar.simple('Tillykke! Du har fået banko!', '#fff', '#008000', 2, true);
            this.locationSubscription.unsubscribe();
        }
        else if (!this.adventureList.isCompleted) {
            this.adventureListService.updateAdventureList(this.adventureListId, { isCompleted: false });
        }
    }
}
