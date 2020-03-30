import { Component, OnInit } from "@angular/core";
import { AdventureEntry } from "~/app/shared/models/adventureEntry.model";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { switchMap, map } from "rxjs/operators";
import { AdventureListService } from "~/app/shared/services/adventure-list.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "AdventureEntry",
    templateUrl: "./adventure-entry.component.html"
})
export class AdventureEntryComponent implements OnInit {

    adventureEntry: AdventureEntry;
    isLoading: boolean = false;
    constructor(private routerExtensions: RouterExtensions,
        private route: ActivatedRoute,
        private adventureListService: AdventureListService,
        private pageRoute: PageRoute) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        this.isLoading = true;

        this.pageRoute.activatedRoute
            .pipe(switchMap((activatedRoute) => activatedRoute.params))
            .forEach((params) => {
                const adventureListEntryId = params.id;
                this.adventureListService.getAdventureListEntry(adventureListEntryId).then(
                    (adventureEntry: AdventureEntry) => {
                        this.adventureEntry = adventureEntry;
                    });
            });
    }

    onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();

    }
}      
