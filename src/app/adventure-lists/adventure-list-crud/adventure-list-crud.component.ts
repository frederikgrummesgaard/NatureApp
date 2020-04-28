import { Component, OnInit } from "@angular/core";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { AdventureList } from "~/app/shared/models/adventureList.model";
import * as imagepicker from "nativescript-imagepicker";
import * as firebase from "nativescript-plugin-firebase";
import * as enums from 'tns-core-modules/ui/enums';
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { AdventureListService } from "~/app/shared/services/adventure-list.service";
import { switchMap } from "rxjs/operators";

@Component({
    selector: "AdventureListCrud",
    templateUrl: "./adventure-list-crud.component.html",
    styleUrls: ["./adventure-list-crud.component.scss"]
})
export class AdventureListCrudComponent implements OnInit {

    public adventureList: AdventureList = new AdventureList;
    public adventureListId: string;
    public image: any;
    public imagePath: string;
    public isEditing: boolean = false;
    public isSavePressed: boolean = false;
    public title: string = 'Opret bankoplade';

    constructor(private pageRoute: PageRoute,
        private routerExtensions: RouterExtensions,
        private adventureListService: AdventureListService,
        private fb: FormBuilder) {
    }

    public adventureListForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]]
    })

    ngOnInit(): void {
        //Gets the selected AdventureList
        this.pageRoute.activatedRoute
            .pipe(switchMap((activatedRoute) => activatedRoute.params))
            .forEach((params) => {
                if (params.id) {
                    this.isEditing = true;
                    this.title = 'Rediger bankoplade';
                    this.adventureListId = params.id;
                    this.adventureListService.getAdventureList(this.adventureListId).then(
                        (adventureList: AdventureList) => {
                            this.adventureList = adventureList;
                            this.adventureListForm.get('name').setValue(this.adventureList.name);
                            this.adventureListForm.get('description').setValue(this.adventureList.description);
                            this.image = this.adventureList.pictureURL;
                        });
                }
            })
    }

    public onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();

    }

    public addOrRemoveImage() {
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
    public saveFile(result) {
        let imageSrc = result;
        this.imagePath = this.adventureListService.documentsPath(`${this.adventureListForm.get('name').value}.jpeg`)
        imageSrc.saveToFile(this.imagePath, enums.ImageFormat.jpeg);
    }
    public onDeleteButtonTap() {
        //Extracts the filename from firebases access token
        let array = this.adventureList.pictureURL.split('%');
        array = array[1].split('?');
        let filename = array[0].substring(2, array[0].length)

        this.adventureListService.deleteAdventureList(this.adventureListId);
        firebase.storage.deleteFile({
            remoteFullPath: '/images/' + filename,
        });
        this.routerExtensions.navigate(["/adventure"],
            {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
    }

    public onSaveButtonTap(): void {
        this.isSavePressed = true;
        if (!this.adventureList.pictureURL || this.imagePath) {
            this.adventureListService.uploadFile(this.imagePath)
                .then((uploadedFile) => {
                    this.adventureListService.downloadUrl('/images/' + uploadedFile.name)
                        .then((downloadUrl: string) => {
                            this.createOrUpdateAdventureList(downloadUrl);
                        }).then(() => this.onBackButtonTap());
                })
        } else if (this.adventureList.pictureURL) {
            this.createOrUpdateAdventureList(this.adventureList.pictureURL);
            this.onBackButtonTap();
        } else {
            this.isSavePressed = false;
            alert('Sikre at navn, billede og beskrivelse er indtastet korrekt')
        }
    }

    private createOrUpdateAdventureList(imageUrl) {
        if (this.adventureListForm.valid) {
            if (!this.isEditing) {
                firebase.firestore.collection('adventurelists').add({
                    name: this.adventureListForm.get('name').value,
                    description: this.adventureListForm.get('description').value,
                    pictureURL: imageUrl,
                })
            } else {
                this.adventureListService.updateAdventureList(this.adventureListId, {
                    name: this.adventureListForm.get('name').value,
                    description: this.adventureListForm.get('description').value,
                    pictureURL: imageUrl,
                })
            }
        }
    }
}
