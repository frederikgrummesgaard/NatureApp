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
import { AdventureEntry } from "~/app/shared/models/adventureEntry.model";
import { Router } from "@angular/router";
import { UtilityService } from "~/app/shared/services/utility.service";

@Component({
    selector: "AdventureListEntryCrud",
    templateUrl: "./adventure-list-entry-crud.component.html",
    styleUrls: ["./adventure-list-entry-crud.component.scss"]
})
export class AdventureListEntryCrudComponent implements OnInit {

    public adventureEntry: AdventureEntry = new AdventureEntry;
    public adventureListEntryId: string;
    public adventureListId: string;
    public image: any;
    public imagePath: string;
    public isEditing: boolean = false;
    public isSavePressed: boolean = false;
    public urlArray: string[];
    public title: string = 'Opret';

    constructor(private pageRoute: PageRoute,
        private router: Router,
        private routerExtensions: RouterExtensions,
        private adventureListService: AdventureListService,
        private utilityService: UtilityService,
        private fb: FormBuilder) {
    }

    public adventureListEntryForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]]
    })

    ngOnInit(): void {
        this.urlArray = this.router.url.split('/');
        this.adventureListId = this.urlArray[3];
        //Gets the selected AdventureListEntry 
        if (this.urlArray.length === 6) {
            this.pageRoute.activatedRoute
                .pipe(switchMap((activatedRoute) => activatedRoute.params))
                .forEach((params) => {
                    if (params.id) {
                        this.isEditing = true;
                        this.title = 'Rediger';
                        this.adventureListEntryId = params.id;
                        this.adventureListService.getAdventureListEntry(this.adventureListEntryId).then(
                            (adventureListEntry: AdventureEntry) => {
                                this.adventureEntry = adventureListEntry;
                                this.adventureListEntryForm.get('name').setValue(this.adventureEntry.name);
                                this.adventureListEntryForm.get('description').setValue(this.adventureEntry.description);
                                this.image = this.adventureEntry.pictureURL;
                            });
                    }
                })
        }
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
        this.imagePath = this.utilityService.documentsPath(`${this.adventureListEntryForm.get('name').value}.png`)
        imageSrc.saveToFile(this.imagePath, enums.ImageFormat.png, 20);
    }
    public onDeleteButtonTap() {
        //Extracts the filename from firebases access token
        let array = this.adventureEntry.pictureURL.split('%');
        array = array[1].split('?');
        let filename = array[0].substring(2, array[0].length)

        this.adventureListService.deleteEntry(this.adventureListId, this.adventureListEntryId);
        firebase.storage.deleteFile({
            remoteFullPath: '/images/' + filename,
        });
        this.routerExtensions.navigate(["/adventure/"],
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
        if (!this.adventureEntry.pictureURL || this.imagePath) {
            this.utilityService.uploadImageFile(this.imagePath)
                .then((uploadedFile) => {
                    this.utilityService.downloadUrl('/images/' + uploadedFile.name)
                        .then((downloadUrl: string) => {
                            this.createOrUpdateAdventureListEntry(downloadUrl);
                        }).then(() => this.onBackButtonTap());
                })
        } else if (this.adventureEntry.pictureURL) {
            this.createOrUpdateAdventureListEntry(this.adventureEntry.pictureURL);
            this.onBackButtonTap();
        } else {
            alert('Sikre at navn, billede og beskrivelse er indtastet korrekt')
        }
        this.isSavePressed = false;
    }

    private createOrUpdateAdventureListEntry(imageUrl) {
        if (this.adventureListEntryForm.valid) {
            if (!this.isEditing) {
                firebase.firestore.collection('adventurelists').doc(this.adventureListId)
                    .collection('entries').add({
                        name: this.adventureListEntryForm.get('name').value,
                        description: this.adventureListEntryForm.get('description').value,
                        pictureURL: imageUrl,
                    })
            } else {
                firebase.firestore.collection('adventurelists').doc(this.adventureListId)
                    .collection('entries').doc(this.adventureListEntryId).update({
                        name: this.adventureListEntryForm.get('name').value,
                        description: this.adventureListEntryForm.get('description').value,
                        pictureURL: imageUrl,
                    });
            }
        }
    }
}
