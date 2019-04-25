import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { DashboardPage } from './dashboard/dashboard.page';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [DashboardPage],
  imports: [
    CommonModule,
    MembersRoutingModule,
    IonicModule
  ]
})
export class MembersModule { }
