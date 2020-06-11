import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Tale } from "~/app/shared/models/tale.model";
import { TaleService } from "~/app/shared/services/tale.service";
import { UserService } from "~/app/shared/services/user.service";
import { switchMap } from "rxjs/operators";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { TaleCategory } from "~/app/shared/models/taleCategory";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { ListViewEventData } from "nativescript-ui-listview";
import { SubscriptionModalComponent } from "~/app/shared/subscription-modal/subscription-modal.component";
import { ExtendedShowModalOptions } from "nativescript-windowed-modal";
import { ModalDialogService } from "nativescript-angular/common";

@Component({
    selector: "Tales",
    templateUrl: "./tales.component.html",
    styleUrls: ["./tales.component.scss"]

})
export class TalesComponent implements OnInit {
    public isLoading: boolean = false;
    public isAdmin: boolean;
    public isSubscriber: boolean;
    public tale: Tale;
    public tales: ObservableArray<Tale> = new ObservableArray<Tale>([]);
    public taleCategoryId: string;
    public taleCategory: TaleCategory;

    constructor(private userService: UserService,
        private taleService: TaleService,
        private pageRoute: PageRoute,
        private routerExtensions: RouterExtensions,
        private viewContainerRef: ViewContainerRef,
        private modalService: ModalDialogService, ) {
        let date = new Date();
        if (this.userService.user) {
            this.userService.user.isAdmin ? this.isAdmin = true : this.isAdmin = false;
            if (this.userService.user.subscriptionEnds) {
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
        this.isLoading = true;
        this.pageRoute.activatedRoute
            .pipe(switchMap((activatedRoute) => activatedRoute.params))
            .forEach((params) => {
                this.taleCategoryId = params.id;
                this.taleService.getTaleCategory(this.taleCategoryId).then(
                    (taleCategory: TaleCategory) => {
                        this.taleCategory = taleCategory;
                    });
                this.loadTales(this.taleCategoryId);
                this.isLoading = false;
            });

    }

    loadTales(categoryId: string) {
        this.taleService.getTales(categoryId).then(taleDB => {
            const myList = <any>taleDB;
            if (this.isSubscriber) {
                myList.forEach((tale: Tale) => {
                    this.tales.push(tale);
                });
                this.tales.sort((tale1: Tale, tale2: Tale) => {
                    return tale1.id >= tale2.id ? 1 : -1
                })
            } else {
                const tale = <any>taleDB;
                this.tales.push(tale);
            }
        });
    }

    onTaleItemTap(args: ListViewEventData): void {
        const tappedAdventureItem = args.view.bindingContext;

        this.routerExtensions.navigate(["/tale-categories/tales/" + this.taleCategoryId + '/tale', tappedAdventureItem.id],
            {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
    }
    onCreateTale() {
        if (this.isAdmin) {
            this.routerExtensions.navigate(["/tale-categories/tales/" + this.taleCategoryId
                + "/tale-crud"],
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

    onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();
    }

    onSubscriptionButtonTap(): void {
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
}
