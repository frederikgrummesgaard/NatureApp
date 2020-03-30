import { Component, OnInit } from "@angular/core";
import { AdventureList } from "~/app/shared/models/adventureList.model";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { AdventureListService } from "~/app/shared/services/adventure-list.service";
import { switchMap } from "rxjs/operators";
import { AdventureEntry } from "~/app/shared/models/adventureEntry.model";
import { ListViewEventData } from "nativescript-ui-listview";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "AdventuresList",
    templateUrl: "./adventure-list.component.html",
    styleUrls: ["./adventure-list.component.scss"]

})
export class AdventureListComponent implements OnInit {
    public isLoading: boolean = false;
    public adventureList: AdventureList;
    public adventureEntries: AdventureEntry[];
    public adventureListId: string;

    constructor(private routerExtensions: RouterExtensions,
        private route: ActivatedRoute,
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
                this.adventureListId = params.id;
                this.adventureListService.getAdventureList(this.adventureListId).then(
                    (adventureList: AdventureList) => {
                        this.adventureList = adventureList;
                    });
                this.adventureListService.getAdventureListEntries(this.adventureListId).then(
                    (adventureList: any) => {
                        this.adventureEntries = adventureList;
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
}
