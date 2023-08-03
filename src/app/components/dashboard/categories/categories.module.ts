import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormCategoryComponent } from './form-category/form-category.component';
import { CategoriesComponent } from './categories.component';
import { DialogFiltersComponent } from './dialog-filters/dialog-filters.component';


const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: 'categories', component: CategoriesComponent },
      { path: 'add-category', component: FormCategoryComponent },
      { path: 'edit-category', component: FormCategoryComponent }
    ]
  },

];
@NgModule({
  declarations: [
    CategoriesComponent,
    FormCategoryComponent,
    DialogFiltersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ]
})
export class CategoryModule { }
