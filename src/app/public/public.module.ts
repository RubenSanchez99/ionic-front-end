import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [LoginPage, RegisterPage],
  imports: [
    CommonModule,
    PublicRoutingModule,
    IonicModule
  ]
})
export class PublicModule { }
