import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { AdventureList } from "~/app/shared/models/adventureList.model";
import * as imagepicker from "nativescript-imagepicker";
import * as firebase from "nativescript-plugin-firebase";
import * as enums from 'tns-core-modules/ui/enums';
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { AdventureListService } from "~/app/shared/services/adventure-list.service";

@Component({
    selector: "AdventureListCrud",
    templateUrl: "./adventure-list-crud.component.html",
    styleUrls: ["./adventure-list-crud.component.scss"]
})
export class AdventureListCrudComponent implements OnInit {

    public adventureList: AdventureList;
    public image: any;
    public imagePath: string;

    constructor(private routerExtensions: RouterExtensions,
        private adventureListService: AdventureListService,
        private fb: FormBuilder) {
    }

    adventureListForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]]
    })

    ngOnInit(): void {
    }

    onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();

    }

    addOrRemoveImage() {
        if (this.image) {
            this.image = null;
            return;
        }
        let context = imagepicker.create({
            mode: "single"
        });
        context.authorize()
            .then(() => {
                this.image = null;
                return context.present();
            })
            .then((imageAsset) => {
                ImageSource.fromAsset(imageAsset[0]).then(result => {
                    this.image = result;
                    this.saveFile(this.image);
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    saveFile(result) {
        let imageSrc = result;
        this.imagePath = this.adventureListService.documentsPath(`${this.adventureListForm.get('name').value}.jpeg`)
        imageSrc.saveToFile(this.imagePath, enums.ImageFormat.jpeg);
    }

    onCreateButtonTap(): void {
        if (this.imagePath) {
            this.adventureListService.uploadFile(this.imagePath)
                .then((uploadedFile) => {
                    this.adventureListService.downloadUrl('/images/' + uploadedFile.name)
                        .then((downloadUrl: string) => {
                            if (this.adventureListForm.valid) {
                                firebase.firestore.collection('adventurelists').add({
                                    name: this.adventureListForm.get('name').value,
                                    description: this.adventureListForm.get('description').value,
                                    pictureURL: downloadUrl,
                                })
                            }
                        }).then(() => this.onBackButtonTap());
                })
        } else {
            alert('Navn, billede og beskrivelse skal være udfyldt korrekt, før bankopladen kan oprettes')
        }
    }
}
