import * as firebase from "nativescript-plugin-firebase";
import { Injectable } from "@angular/core";
import { getString, setString } from "tns-core-modules/application-settings";
import { User } from "../models/user.model";

let userToken = 'token'

@Injectable({
    providedIn: "root"
})

export class UserService {

    public user: User;

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
            return firebase.firestore.collection('users').doc(result.uid)
                .set({
                    email: result.email,
                });
        }, () => {
            alert("Sørg for at det er en gyldig email og at adgangskoden stemmer overens. Adgangskoden skal mindst indeholde 6 tegn");
        }
        )
    }

    login(user: User) {
        return firebase.login({
            type: firebase.LoginType.PASSWORD,
            passwordOptions: {
                email: user.email,
                password: user.password
            }
        }).then((result: any) => {
            userToken = result.uid;
            const user = {
                id: result.uid,
                email: result.email,
                password: result.password,
                isAdmin: null
            }
            this.user = user;
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

}