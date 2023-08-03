import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { DialogFiltersComponent } from './dialog-filters/dialog-filters.component';
import { FormItemComponent } from './form-item/form-item.component';
import { ItemsComponent } from './items.component';


const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: 'items', component: ItemsComponent },
      { path: 'add-item', component: FormItemComponent },
      { path: 'edit-item', component: FormItemComponent }
    ]
  },

];
@NgModule({
  declarations: [
    ItemsComponent,
    FormItemComponent,
    DialogFiltersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ]
})
export class ItemsModule { }
