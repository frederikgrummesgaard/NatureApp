import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { AdventureList } from "~/app/shared/models/adventureList.model";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { AdventureListService } from "~/app/shared/services/adventure-list.service";
import { switchMap } from "rxjs/operators";

@Component({
    selector: "AdventuresList",
    templateUrl: "./adventure-list.component.html"
})
export class AdventureListComponent implements OnInit {

    public adventureList: AdventureList;

    constructor(private routerExtensions: RouterExtensions,
        private adventureListService: AdventureListService,
        private pageRoute: PageRoute) {
    }

    ngOnInit(): void {
        this.pageRoute.activatedRoute
            .pipe(switchMap((activatedRoute) => activatedRoute.params))
            .forEach((params) => {
                const adventureListId = params.id;
                this.adventureList = this.adventureListService.getAdventureList(adventureListId);
                console.log('adventureList', this.adventureList);
            });
    }

    onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();
    }
}
