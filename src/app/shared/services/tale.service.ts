import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import { TaleCategory } from "../models/taleCategory";
import { UserService } from "./user.service";

@Injectable({
    providedIn: "root"
})
export class TaleService {

    public taleCategories;

    constructor(private userService: UserService) {
        this.taleCategories = firebase.firestore.collection('tale-categories');
    }
    getTaleCategories() {
        return new Promise((resolve, reject) => {
            this.taleCategories.get()
                .then(querySnapshot => {
                    const categories: TaleCategory[] = [];
                    querySnapshot.forEach(category => {
                        let dataToSave = category.data();
                        dataToSave.id = category.id;
                        categories.push(dataToSave);
                    });
                    resolve(categories);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }

    getTaleCategory(CategoryId: string) {
        return new Promise((resolve, reject) => {
            this.taleCategories.doc(CategoryId).get()
                .then((adventureList) => {
                    resolve(adventureList.data());
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });

        });
    }

    getTales(CategoryId: string) {
        let date = new Date();
        return new Promise((resolve, reject) => {
            this.taleCategories.doc(CategoryId).collection('tales').get()
                .then(querySnapshot => {
                    const tales = [];
                    querySnapshot.forEach(tale => {
                        let dataToSave = tale.data();
                        dataToSave.id = tale.id;
                        tales.push(dataToSave)
                    });
                    if (this.userService.user.subscriptionEnds >= date) {
                        resolve(tales);
                    } else {
                        resolve(tales[0]);
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }
    getTale(categoryId: string, taleId: string) {
        return new Promise((resolve, reject) => {
            this.taleCategories.doc(categoryId).collection('tales').doc(taleId).get()
                .then((tale: any) => {
                    resolve(tale.data());
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    public deleteTale(categoryId: string, taleId: string) {
        this.taleCategories.doc(categoryId).collection('tales').doc(taleId).delete();
    }
}