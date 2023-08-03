import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';
import { CategoryModule } from './categories/categories.module';
import { ItemsModule } from './items/items.module';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: 'home', component: HomeComponent },


    ]
  },

];

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    NavbarComponent,
    DialogConfirmComponent,
   
  ],
  imports: [
    CommonModule,
    CategoryModule,
    ItemsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
