import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CatalogItemsPage } from "./catalog-items/catalog-items.page";
import { CatalogDetailPage } from "./catalog-detail/catalog-detail.page";
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: "catalog",
    component: CatalogItemsPage,
    canActivate: [AuthGuard],
  },
  {
    path: "catalog/:id",
    component: CatalogDetailPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
