import { Component } from "@angular/core";

import { Platform, ToastController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthenticationService } from "./services/authentication.service";
import { Router } from "@angular/router";
import { FcmService } from "./services/fcm.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  public appPages = [
    {
      title: "Catalog",
      url: "/catalog",
      icon: "list"
    },
    {
      title: "Dashboard",
      url: "/members/dashboard",
      icon: "person"
    },
    {
      title: "Map",
      url: "/map",
      icon: "map"
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router,
    private fcm: FcmService,
    public toastController: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.notificationSetup();

      this.authenticationService.authenticationState.subscribe(state => {
        if (state) {
          this.router.navigate(["members", "dashboard"]);
        } else {
          this.router.navigate(["login"]);
        }
      });
    });
  }

  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  private notificationSetup() {
    this.fcm.getToken();
    this.fcm.onNotifications().subscribe(msg => {
      if (this.platform.is("ios")) {
        this.presentToast(msg.aps.alert);
      } else {
        this.presentToast(msg.body);
      }
    });
  }
}
