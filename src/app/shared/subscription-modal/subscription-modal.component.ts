import { Component, OnInit } from "@angular/core";
import { UserService } from "~/app/shared/services/user.service";
import { ModalDialogParams } from "nativescript-angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { Product } from "nativescript-purchase/product";
import * as applicationSettings from "tns-core-modules/application-settings";
import * as purchase from "nativescript-purchase";
import { Transaction, TransactionState } from "nativescript-purchase/transaction";

@Component({
    selector: "subscription-modal",
    templateUrl: "./subscription-modal.component.html",
    styleUrls: ["./subscription-modal.component.scss"]

})
export class SubscriptionModalComponent implements OnInit {

    public products: Product[];
    public duration: number;

    constructor(private userService: UserService,
        private routerExtensions: RouterExtensions,
        private params: ModalDialogParams) { }

    ngOnInit(): void {
        (global as any).purchaseInitPromise.then(() => {
            purchase.getProducts().then((productsToImplement: Array<Product>) => {
                this.products = productsToImplement;
            })
        });

        purchase.on(purchase.transactionUpdatedEvent, (transaction: Transaction) => {
            if (transaction.transactionState === TransactionState.Restored) {
                applicationSettings.setBoolean(transaction.productIdentifier, true);
            }
            if (transaction.transactionState === TransactionState.Purchased) {
                applicationSettings.setBoolean(transaction.productIdentifier, true);
                this.userService.createSubscriber(this.duration);
            } else if (transaction.transactionState === TransactionState.Failed) {
                alert(`køb af ${transaction.productIdentifier} gik ikke igennem`);
            }
        });
        console.log("before", this.products);
    }

    buySubscription(product: Product, duration) {
        this.duration = duration;
        purchase.buyProduct(product);
    }

    buy1MonthSubscription() {
        console.log("product:", this.products[0]);
        if (this.products[0]) {
            this.buySubscription(this.products[0], 1);
        }
        this.params.closeCallback();
    }

    buy3MonthSubscription() {
        console.log("product:", this.products[1]);
        if (this.products[1]) {
            this.buySubscription(this.products[1], 3);
        }
        this.params.closeCallback();
    }
}
