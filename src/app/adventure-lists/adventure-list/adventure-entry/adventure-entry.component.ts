import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AdventureEntry } from "~/app/shared/models/adventureEntry.model";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { switchMap, map } from "rxjs/operators";
import { AdventureListService } from "~/app/shared/services/adventure-list.service";
import { Router } from "@angular/router";
import { UserService } from "~/app/shared/services/user.service";

@Component({
    selector: "AdventureEntry",
    templateUrl: "./adventure-entry.component.html",
    styleUrls: ["./adventure-entry.component.scss"]
})
export class AdventureEntryComponent implements OnInit {

    adventureEntry: AdventureEntry;
    adventureListEntryId: string;
    adventureListId: string;
    isLoading: boolean = false;
    isAdmin: boolean = false;
    constructor(private routerExtensions: RouterExtensions,
        private adventureListService: AdventureListService,
        private userService: UserService,
        private router: Router,
        private pageRoute: PageRoute) {
        if (this.userService.user) {
            this.userService.user.isAdmin ? this.isAdmin = true : this.isAdmin = false;
        } else {
            this.isAdmin = false;
        }
    }

    ngOnInit(): void {
        this.isLoading = true;
        let urlArray = this.router.url.split('/')
        this.adventureListId = urlArray[3];
        this.pageRoute.activatedRoute
            .pipe(switchMap((activatedRoute) => activatedRoute.params))
            .forEach((params) => {
                this.adventureListEntryId = params.id;
                this.adventureListService.getAdventureListEntry(this.adventureListEntryId).then(
                    (adventureEntry: AdventureEntry) => {
                        this.adventureEntry = adventureEntry;
                        this.isLoading = false;
                    });
            });
    }

    toggleDiscoveredButton(): void {
        this.adventureEntry.isDiscovered = !this.adventureEntry.isDiscovered;
        this.adventureListService.changeEntryDiscoveredState(this.adventureListId, this.adventureListEntryId,
            {
                isDiscovered: this.adventureEntry.isDiscovered
            })
    }

    onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();
    }

    onEditButtonTap(): void {
        if (this.isAdmin) {
            this.routerExtensions.navigate(["/adventure/adventure-list/" + this.adventureListId + "/adventure-list-entry-crud", this.adventureListEntryId],
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

}      
