import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { AdventureList } from "~/app/shared/models/adventureList.model";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { AdventureListService } from "~/app/shared/services/adventure-list.service";
import { switchMap } from "rxjs/operators";
import { AdventureEntry } from "~/app/shared/models/adventureEntry.model";

@Component({
    selector: "AdventuresList",
    templateUrl: "./adventure-list.component.html"
})
export class AdventureListComponent implements OnInit {
    public isLoading: boolean = false;
    public adventureList: AdventureList;
    public adventureEntries: AdventureEntry[];

    constructor(private routerExtensions: RouterExtensions,
        private adventureListService: AdventureListService,
        private pageRoute: PageRoute) {
    }

    ngOnInit(): void {
        this.loadingAdventureList();
    }

    loadingAdventureList() {
        this.isLoading = true;
        this.pageRoute.activatedRoute
            .pipe(switchMap((activatedRoute) => activatedRoute.params))
            .forEach((params) => {
                const adventureListId = params.id;
                this.adventureListService.getAdventureList(adventureListId).then(
                    (adventureList: AdventureList) => {
                        this.adventureList = adventureList;
                        this.adventureEntries = adventureList.adventureEntries;
                        console.log('a', adventureList);
                        this.isLoading = false;
                    });
            });
    }

    onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();
    }
}
