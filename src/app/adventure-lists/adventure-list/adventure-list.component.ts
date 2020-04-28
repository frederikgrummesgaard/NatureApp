import { Component, OnInit } from "@angular/core";
import { AdventureList } from "~/app/shared/models/adventureList.model";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { AdventureListService } from "~/app/shared/services/adventure-list.service";
import { switchMap } from "rxjs/operators";
import { AdventureEntry } from "~/app/shared/models/adventureEntry.model";
import { ListViewEventData } from "nativescript-ui-listview";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { SnackBar } from "@nstudio/nativescript-snackbar";
import { UserService } from "~/app/shared/services/user.service";
import * as firebase from "nativescript-plugin-firebase";
import { Page } from "tns-core-modules/ui/page/page";

@Component({
    selector: "AdventuresList",
    templateUrl: "./adventure-list.component.html",
    styleUrls: ["./adventure-list.component.scss"]

})
export class AdventureListComponent implements OnInit {
    public isLoading: boolean = false;
    public adventureList: AdventureList;
    public adventureEntries$: ObservableArray<AdventureEntry>;
    public adventureListId: string;
    public isAdmin: boolean = false;

    constructor(private routerExtensions: RouterExtensions,
        private pageRoute: PageRoute,
        private page: Page,
        private adventureListService: AdventureListService,
        private userService: UserService) {

        if (this.userService.user.isAdmin) {
            this.isAdmin = true;
        }
    }

    ngOnInit(): void {
        this.loadingAdventureList();

        this.page.on('loaded', () => {
            this.getEntries();
        })
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
                this.getEntries();
            });
    }

    private getEntries() {
        this.adventureListService.getAdventureListEntries(this.adventureListId).then((adventureListEntries: any) => {
            this.adventureEntries$ = adventureListEntries;
            const snackbar = new SnackBar();
            this.isAdventureListCompleted(adventureListEntries, snackbar);
            this.isLoading = false;
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
    private isAdventureListCompleted(adventureListEntries: AdventureEntry[], snackbar: SnackBar) {
        let isAllreadyCompleted = false;
        firebase.firestore.collection('users').doc(this.userService.user.id).collection('adventure-lists')
            .doc(this.adventureListId).get()
            .then((userAdventureList) => {
                if (!userAdventureList.exists) {
                    firebase.firestore.collection('users').doc(this.userService.user.id).collection('adventure-lists')
                        .doc(this.adventureListId).set({
                            isCompleted: false,
                        })
                }
                if (userAdventureList.data().isCompleted) {
                    isAllreadyCompleted = userAdventureList.data().isCompleted;
                }

            }).then(() => {
                this.adventureList.isCompleted = true;
                adventureListEntries.forEach((entry: AdventureEntry) => {
                    if (!entry.isDiscovered) {
                        this.adventureList.isCompleted = false;
                    }
                });
                if (!isAllreadyCompleted && this.adventureList.isCompleted) {
                    this.adventureListService.changeAdventureListDiscoveredState(this.adventureListId, { isCompleted: true });
                    snackbar.simple('Tillykke! Du har fået banko!', '#fff', '#008000', 2, true);
                }
                else if (isAllreadyCompleted && !this.adventureList.isCompleted) {
                    this.adventureListService.changeAdventureListDiscoveredState(this.adventureListId, { isCompleted: false });
                }
            })
    }
}
