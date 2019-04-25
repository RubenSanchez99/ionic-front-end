import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MapPage } from "./map/map.page";

const routes: Routes = [{ path: "map", component: MapPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule {}
