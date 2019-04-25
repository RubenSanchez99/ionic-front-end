import { Component, OnInit, AfterViewInit } from "@angular/core";
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker
} from "@ionic-native/google-maps";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-map",
  templateUrl: "./map.page.html",
  styleUrls: ["./map.page.scss"]
})
export class MapPage implements OnInit, AfterViewInit {
  constructor(public platform: Platform) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  loadMap() {
    const map = GoogleMaps.create("map");

    map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
      const coordinates: LatLng = new LatLng(25.665818, -100.341223);

      const position = {
        target: coordinates,
        zoom: 14
      };

      map.animateCamera(position);

      const markerOptions: MarkerOptions = {
        position: coordinates,
        icon: "assets/images/marker.png",
        title: "Hello CDIS"
      };

      const marker = map.addMarker(markerOptions).then((marker: Marker) => {
        marker.showInfoWindow();
      });
    });
  }
}
