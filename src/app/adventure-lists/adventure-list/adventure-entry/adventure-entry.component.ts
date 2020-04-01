import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AdventureEntry } from "~/app/shared/models/adventureEntry.model";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { switchMap, map } from "rxjs/operators";
import { AdventureListService } from "~/app/shared/services/adventure-list.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "AdventureEntry",
    templateUrl: "./adventure-entry.component.html",
    styleUrls: ["./adventure-entry.component.scss"]
})
export class AdventureEntryComponent implements OnInit {

    adventureEntry: AdventureEntry;
    adventureListEntryId: string;
    isLoading: boolean = false;
    constructor(private routerExtensions: RouterExtensions,
        private adventureListService: AdventureListService,
        private pageRoute: PageRoute) {
    }

    ngOnInit(): void {
        this.isLoading = true;

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
        this.adventureListService.updateAdventureListEntry(this.adventureListEntryId,
            {
                isDiscovered: this.adventureEntry.isDiscovered
            })
    }

    onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();

    }
}      
