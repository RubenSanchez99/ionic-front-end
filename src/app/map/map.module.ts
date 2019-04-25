import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MapRoutingModule } from "./map-routing.module";
import { MapPage } from "./map/map.page";

import { GoogleMaps } from "@ionic-native/google-maps";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [MapPage],
  imports: [CommonModule, MapRoutingModule, IonicModule],
  providers: [GoogleMaps]
})
export class MapModule {}
