import { Component, OnInit } from "@angular/core";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import * as imagepicker from "nativescript-imagepicker";
import * as firebase from "nativescript-plugin-firebase";
import * as enums from 'tns-core-modules/ui/enums';
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { switchMap } from "rxjs/operators";
import { Tale } from "~/app/shared/models/tale.model";
import { TaleService } from "~/app/shared/services/tale.service";
import { Router } from "@angular/router";
import { UtilityService } from "~/app/shared/services/utility.service";

@Component({
    selector: "TaleCrud",
    templateUrl: "./tale-crud.component.html",
    styleUrls: ["./tale-crud.component.scss"]
})
export class TaleCrudComponent implements OnInit {

    public tale: Tale = new Tale;
    public taleCategoryId: string;
    public taleId: string;
    public image: any;
    public imagePath: string;
    public audioPath: string;
    public audioFile: any = true;
    public audioFileName: string = 'aaa';
    public isEditing: boolean = false;
    public isSavePressed: boolean = false;
    public title: string = 'Opret fortælling';
    public urlArray: string[];

    constructor(private pageRoute: PageRoute,
        private router: Router,
        private routerExtensions: RouterExtensions,
        private taleService: TaleService,
        private utilityService: UtilityService,
        private fb: FormBuilder) {
    }

    public taleForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]]
    })

    ngOnInit(): void {
        this.urlArray = this.router.url.split('/');
        this.taleCategoryId = this.urlArray[3];
        //Gets the selected tale
        if (this.urlArray.length === 6) {
            this.pageRoute.activatedRoute
                .pipe(switchMap((activatedRoute) => activatedRoute.params))
                .forEach((params) => {
                    if (params.id) {
                        this.isEditing = true;
                        this.title = 'Rediger fortælling';
                        this.taleId = params.id;
                        this.taleService.getTale(this.taleCategoryId, this.taleId).then(
                            (tale: Tale) => {
                                this.tale = tale;
                                this.taleForm.get('name').setValue(this.tale.name);
                                this.taleForm.get('description').setValue(this.tale.description);
                                this.image = this.tale.pictureURL;
                            });
                    }
                })
        }
    }

    public onBackButtonTap(): void {
        this.routerExtensions.backToPreviousPage();

    }
    public addOrRemoveAudioFile() {
        if (this.audioFile) {
            this.audioFile = null;
            return;
        }
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
                    this.saveImageFile(this.image);
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    public saveImageFile(result) {
        let imageSrc = result;
        this.imagePath = this.utilityService.documentsPath(`${this.taleForm.get('name').value}.jpeg`)
        imageSrc.saveToFile(this.imagePath, enums.ImageFormat.jpeg, 10);
    }
    public saveAudioFile(result) {
        let audioSrc = result;
        this.audioPath = this.utilityService.documentsPath(`${this.taleForm.get('name').value}.mp3`)
        audioSrc.saveToFile(this.audioPath, enums, 10);
    }

    public onDeleteButtonTap() {
        //Extracts the filename from firebases access token
        let array = this.tale.pictureURL.split('%');
        array = array[1].split('?');
        let filename = array[0].substring(2, array[0].length)

        this.taleService.deleteTale(this.taleCategoryId, this.taleId);
        firebase.storage.deleteFile({
            remoteFullPath: '/images/' + filename,
        });
        this.routerExtensions.navigate(["/tale-categories"],
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
        if (!this.tale.pictureURL || this.imagePath) {
            this.utilityService.uploadImageFile(this.imagePath)
                .then((uploadedFile) => {
                    this.utilityService.downloadUrl('/images/' + uploadedFile.name)
                        .then((downloadUrl: string) => {
                            this.createOrUpdateTale(downloadUrl);
                        }).then(() => this.onBackButtonTap());
                })
        } else if (this.tale.pictureURL) {
            this.createOrUpdateTale(this.tale.pictureURL);
            this.onBackButtonTap();
        } else {
            this.isSavePressed = false;
            alert('Sikre at navn, billede og beskrivelse er indtastet korrekt')
        }
    }

    private createOrUpdateTale(imageUrl) {
        if (this.taleForm.valid) {
            if (!this.isEditing) {
                firebase.firestore.collection('tale-categories').doc(this.taleCategoryId)
                    .collection('tales').add({
                        name: this.taleForm.get('name').value,
                        description: this.taleForm.get('description').value,
                        pictureURL: imageUrl,
                    })
            } else {
                firebase.firestore.collection('tale-categories').doc(this.taleCategoryId)
                    .collection('tales').doc(this.taleId).update({
                        name: this.taleForm.get('name').value,
                        description: this.taleForm.get('description').value,
                        pictureURL: imageUrl,
                    });
            }
        }
    }
}
