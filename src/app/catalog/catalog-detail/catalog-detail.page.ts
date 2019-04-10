import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CatalogService } from "../catalog.service";
import { CatalogBrand, CatalogType, Image } from "../types";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import {
  ToastController,
  LoadingController,
  ActionSheetController,
  Platform
} from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
import {
  Camera,
  CameraOptions,
  PictureSourceType
} from "@ionic-native/camera/ngx";
import { File, FileEntry } from "@ionic-native/file/ngx";

@Component({
  selector: "app-catalog-detail",
  templateUrl: "./catalog-detail.page.html",
  styleUrls: ["./catalog-detail.page.scss"]
})
export class CatalogDetailPage implements OnInit {
  types: CatalogType[];
  brands: CatalogBrand[];

  form: FormGroup;

  Title: string;
  SubmitAction: () => void;

  img: Image = {
    name: "",
    path: "",
    filePath: ""
  };

  constructor(
    private formBuilder: FormBuilder,
    private service: CatalogService,
    private toastController: ToastController,
    private router: Router,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private camera: Camera,
    private file: File,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private plt: Platform,
    private ref: ChangeDetectorRef,
    private filePath: FilePath
  ) {}

  pathForImage(img) {
    if (img === null) {
      return "";
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Load from Library",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Use Camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });

    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      if (
        this.plt.is("android") &&
        sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
      ) {
        this.filePath.resolveNativePath(imagePath).then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf("/") + 1);
          let currentName = imagePath.substring(
            imagePath.lastIndexOf("/") + 1,
            imagePath.lastIndexOf("?")
          );
          this.copyFileToLocalDir(
            correctPath,
            currentName,
            this.createFileName()
          );
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);
        this.copyFileToLocalDir(
          correctPath,
          currentName,
          this.createFileName()
        );
      }
    });
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file
      .copyFile(namePath, currentName, this.file.dataDirectory, newFileName)
      .then(
        success => {
          this.updateStoredImage(newFileName);
        },
        error => {
          this.presentToast("Error while storing file.");
        }
      );
  }

  updateStoredImage(name) {
    let filePath = this.file.dataDirectory + name;
    let resPath = this.pathForImage(filePath);

    this.img = {
      name: name,
      path: resPath,
      filePath: filePath
    };

    this.ref.detectChanges();
  }

  deleteImage(imgEntry) {
    var correctPath = imgEntry.filePath.substr(
      0,
      imgEntry.filePath.lastIndexOf("/") + 1
    );

    this.file.removeFile(correctPath, imgEntry.name).then(res => {
      this.presentToast("File removed.");
      this.img = {
        name: "",
        path: "",
        filePath: ""
      }
    });
  }

  async startUpload(imgEntry: Image) {
    const entry = await this.file.resolveLocalFilesystemUrl(imgEntry.filePath);
    const file = await this.getFile(entry);
    this.img.blob = await this.readFile(file);
  }

  async getFile(fileEntry) {
    try {
      return await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
    } catch (err) {
      console.log(err);
    }
  }

  readFile(file: any): Promise<Blob> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      reader.onloadend = () => {
        const imgBlob = new Blob([reader.result], {
          type: file.type
        });
        
        resolve(imgBlob);
      };

      reader.readAsArrayBuffer(file);  
    }); 
  }

  ngOnInit() {
    this.service
      .getCatalogTypes()
      .subscribe(data => (this.types = data), err => console.log(err));

    this.service
      .getCatalogBrands()
      .subscribe(data => (this.brands = data), err => console.log(err));

    this.form = this.formBuilder.group({
      Id: new FormControl(""),
      Name: new FormControl("", Validators.required),
      Description: new FormControl("", Validators.required),
      Price: new FormControl("", [Validators.required, Validators.min(0)]),
      CatalogBrandId: new FormControl(this.brands, Validators.required),
      CatalogTypeId: new FormControl(this.types, Validators.required),
      PictureFileName: new FormControl("1.png")
    });

    const id = this.route.snapshot.paramMap.get("id");
    if (!isNaN(Number(id))) {
      this.getData(id);
      this.Title = "Update Item";
      this.SubmitAction = () =>
        this.sendData(
          this.service.updateProduct(this.form.value),
          "Loading...",
          "Item sucessfully updated",
          "/catalog",
          "Error updating item"
        );
    } else {
      this.Title = "Add Item";
      this.SubmitAction = () =>
        this.sendData(
          this.service.addProduct(
            this.form.value,
            this.img.blob,
            this.img.name
          ),
          "Loading...",
          "Item sucessfully added",
          "/catalog",
          "Error adding item"
        );
    }
  }

  async getData(id: string) {
    const loading = await this.loadingController.create({
      message: "Loading"
    });
    await loading.present();
    this.service.getCatalogItem(id).subscribe(
      data => {
        console.log(data);
        this.form.patchValue({
          Id: id,
          Name: data.name,
          Description: data.description,
          Price: data.price,
          CatalogBrandId: data.catalogBrandId,
          CatalogTypeId: data.catalogTypeId,
          PictureFileName: data.PictureFileName
        });
        loading.dismiss();
      },
      err => {
        console.log(err);
        loading.dismiss();
      }
    );
  }

  async onSubmit() {
    if (this.img.name != "") {
      await this.startUpload(this.img);
    }
    this.SubmitAction();
  }

  async sendData(
    dataObservable: Observable<any>,
    loadingMessage: string,
    successMessage: string,
    redirectRoute: string,
    failureMessage: string
  ) {
    const loading = await this.loadingController.create({
      message: loadingMessage
    });
    await loading.present();
    dataObservable.subscribe(
      () => {
        this.presentToast(successMessage);
        this.router.navigateByUrl(redirectRoute);
        loading.dismiss();
      },
      err => {
        this.presentToast(failureMessage);
        console.error(err);
        loading.dismiss();
      }
    );
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
