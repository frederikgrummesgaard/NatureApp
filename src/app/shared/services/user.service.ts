import * as firebase from "nativescript-plugin-firebase";
import { Injectable } from "@angular/core";
import { getString } from "tns-core-modules/application-settings";
import { User } from "../models/user.model";


@Injectable({
    providedIn: "root"
})

export class UserService {

    public token = "token";

    static isLoggedIn(): boolean {
        return !!getString("token");
    }

    static get token(): string {
        return this.token;
    }

    static set token(token: string) {
        this.token = token
    }

    register(user: User) {
        return firebase.createUser({
            email: user.email,
            password: user.password
        }).then(
            function (result: any) {
                return JSON.stringify(result);
            },
            function (errorMessage: any) {
                alert(errorMessage);
            }
        )
    }

    login(user: User) {
        return firebase.login({
            type: firebase.LoginType.PASSWORD,
            email: user.email,
            password: user.password
        }).then((result: any) => {
            this.token = result.uid;
            return JSON.stringify(result);
        }, (errorMessage: any) => {
            alert(errorMessage);
        });
    }

    logout() {
        this.token = "";
        firebase.logout();
    }

    resetPassword(email) {
        return firebase.sendPasswordResetEmail(email).then((result: any) => {
            alert(JSON.stringify(result));
        },
            function (errorMessage: any) {
                alert(errorMessage);
            }
        ).catch((error) => {
            console.log(JSON.stringify(error));
            return Promise.reject(error.message);
        });
    }

}