import { Component, OnInit } from "@angular/core";
import { UserService } from "~/app/shared/services/user.service";
import { ModalDialogParams } from "nativescript-angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { Product } from "nativescript-purchase/product";

@Component({
    selector: "subscription-modal",
    templateUrl: "./subscription-modal.component.html",
    styleUrls: ["./subscription-modal.component.scss"]

})
export class SubscriptionModalComponent implements OnInit {

    public products: Product[] = [];
    constructor(private userService: UserService,
        private routerExtensions: RouterExtensions,
        private params: ModalDialogParams) { }

    ngOnInit(): void {
        this.products = this.userService.initializeInAppPayments();
        console.log(this.products);
    }

    buy1MonthSubscription() {
        console.log("product:", this.products[0]);
        if (this.products[0]) {
            this.userService.buySubscription(this.products[0], 1);
        }
        this.params.closeCallback();
    }

    buy3MonthSubscription() {
        console.log("product:", this.products[1]);
        if (this.products[1]) {
            this.userService.buySubscription(this.products[1], 3);
        }
        this.params.closeCallback();
    }
}
