import * as firebase from "nativescript-plugin-firebase";
import { Injectable } from "@angular/core";
import { getString, setString } from "tns-core-modules/application-settings";
import { User } from "../models/user.model";
import * as applicationSettings from "tns-core-modules/application-settings";
import * as purchase from "nativescript-purchase";
import { Transaction, TransactionState } from "nativescript-purchase/transaction";
import { Product } from "nativescript-purchase/product";

let userToken = 'token'

@Injectable({
    providedIn: "root"
})

export class UserService {

    public user: User;
    public products: Product[];

    static isLoggedIn(): boolean {
        return !!getString("token");
    }

    static get userToken(): string {
        return getString("token");
    }

    static set userToken(theToken: string) {
        setString("token", theToken);
    }

    register(user: User) {
        return firebase.createUser({
            email: user.email,
            password: user.password
        }).then((result: any) => {
            firebase.firestore.collection('users').doc(result.uid)
                .set({
                    name: user.name,
                    email: result.email,
                });
        });
    }

    login(user: User) {
        return firebase.login({
            type: firebase.LoginType.PASSWORD,
            passwordOptions: {
                email: user.email,
                password: user.password
            }
        }).then((result: any) => {
            return JSON.stringify(result);
        }, () => {
            alert("Email eller adgangskode er forkert, prøv igen");
        });
    }

    logout() {
        userToken = "";
        firebase.logout();
    }

    resetPassword(email) {
        console.log(email);
        return firebase.sendPasswordResetEmail(email).then(() => {
            alert('En nulstillings mail er sendt til din email adresse. Bemærk at den kan befinde sig i spam mappen');
        }, () => {
            alert('Der er sket en fejl. Sikre at du har indtastet en gyldig email');
        }
        ).catch((error) => {
            console.log(JSON.stringify(error));
            return Promise.reject(error.message);
        });
    }
    createAdmin(email) {
        console.log(email)
        const addAdmin = firebase.functions.httpsCallable("addAdminRole");
        addAdmin({ email: email }).then((result) => {
            console.log(result);
            alert(email + ' er nu en administrator')
        });
    }

    initializeInAppPayments() {
        let products: Product[] = [];
        (global as any).purchaseInitPromise.then(() => purchase.getProducts().then((productsToImplement: Array<Product>) => {
            products = productsToImplement;
        }));

        purchase.on(purchase.transactionUpdatedEvent, (transaction: Transaction) => {
            if (transaction.transactionState === TransactionState.Restored) {
                applicationSettings.setBoolean(transaction.productIdentifier, true);
            }
            if (transaction.transactionState === TransactionState.Purchased) {
                applicationSettings.setBoolean(transaction.productIdentifier, true);
            }
        });
        console.log("before", products)
        return products
    }

    buySubscription(product, duration) {

        if (purchase.canMakePayments()) {
            purchase.buyProduct(product).then(() => {
                this.createSubscriber(duration);
            });
        }
    }

    createSubscriber(duration) {
        let buyDate = new Date();
        let email = this.user.email;
        const addSubscriber = firebase.functions.httpsCallable("addSubscriberRole");
        addSubscriber({ email: email }).then((result) => {
            console.log(result);
        }).then(() => {
            let subscriptionEnds: Date = buyDate;
            subscriptionEnds.setMonth(buyDate.getMonth() + duration);
            firebase.firestore.collection('users').doc(this.user.id).update({
                subscriptionEnds: subscriptionEnds
            })
            alert('Dit køb er gennemført! Log venligst ud og derefter ind igen, for at få adgang til vores fulde version!')
        });
    }

    removeSubscriber() {
        let email = this.user.email;
        const removeSubscriber = firebase.functions.httpsCallable("removeSubscriberRole");
        removeSubscriber({ email: email }).then((result) => {
            console.log(result);
        })
    }
}