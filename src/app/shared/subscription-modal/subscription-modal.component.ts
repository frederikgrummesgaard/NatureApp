import { Component, OnInit } from "@angular/core";
import { UserService } from "~/app/shared/services/user.service";
import { ModalDialogParams } from "nativescript-angular/common";
import { isIOS } from "tns-core-modules/platform";
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
    public isIOS: boolean;

    constructor(private userService: UserService,
        private params: ModalDialogParams) {
        this.isIOS = isIOS;
    }

    ngOnInit(): void {
        let isCalled = false;
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
                purchase.consumePurchase(transaction.transactionReceipt);
                if (!isCalled) {
                    this.userService.createSubscriber(this.duration);
                    isCalled = true;
                }
            }
        });

    }

    buySubscription(product: Product, duration) {
        this.duration = duration;
        purchase.buyProduct(product);
    }

    buy3MonthSubscription() {
        if (this.products[1]) {
            this.buySubscription(this.products[1], 3);
        }
        this.params.closeCallback();
    }

    buy12MonthSubscription() {
        if (this.products[0]) {
            this.buySubscription(this.products[0], 12);
        }
        this.params.closeCallback();
    }
}
