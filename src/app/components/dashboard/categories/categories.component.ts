import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from "@angular/material/dialog";
import { DialogConfirmComponent } from "../dialog-confirm/dialog-confirm.component";
import { FormCategoryComponent } from './form-category/form-category.component';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';
import { DialogFiltersComponent } from './dialog-filters/dialog-filters.component';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  listCategory: any = [];
  category: Category;
  objetoJson: any;
  id = localStorage.getItem('id');
  search = {
    "pageNo": 0,
    "pageSize": 5,
    "filters": null
  };
  next: Boolean;
  before: Boolean;
  displayedColumns: string[] = ['name', 'description', 'acciones'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  // Private
  /**
    * Constructor
    */
  constructor(private _categoryService: CategoryService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public Dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Category>();
    this.next = true;
    this.before = false;
  }

  ngOnInit(): void {
    this.chargeCategories();
  }
  ngOnDestroy(): void {
    localStorage.removeItem('IsActiveCategory');
  }
  async chargeCategories() {
    if (localStorage.getItem('IsActiveCategory') && localStorage.getItem('IsActiveCategory') !== 'None') {
      this.search.filters = [{ "Alias": "IsActive", "Value": `${localStorage.getItem('IsActiveCategory')}` }]
    } else {
      this.search.filters = null;
    }
    try {
      const res = await firstValueFrom(this._categoryService.getCategories(this.search))
      localStorage.setItem('pageNoC', res.pageNo);
      localStorage.setItem('totalC', res.total);
      this.dataSource.data = res.items;
      this.next = res.total > 5;
    } catch (err) {
      console.log(err);
    }
  }
  async Next() {
    const operator = Number(localStorage.getItem('totalC')) - 5 * (Number(localStorage.getItem('pageNoC')) + 1);
    this.search.pageNo = Number(localStorage.getItem('pageNoC')) + 1
    await this.chargeCategories();
    if (!this.before) {
      this.before = true;
    }
    if (operator < 5) {
      this.next = false;
    }

  }
  async Before() {
    this.search.pageNo = Number(localStorage.getItem('pageNoC')) - 1
    await this.chargeCategories();
    if (Number(localStorage.getItem('pageNoC')) === 0) {
      this.before = false;
    }
    if (!this.next) {
      this.next = true;
    }
  }
  showDialog(index: any): void {
    this.Dialog
      .open(DialogConfirmComponent, {
        data: `Are you sure you want to delete the category?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.deleteCategory(index);
        }
      });
  }
  showDialogFilters(): void {
    this.Dialog
      .open(DialogFiltersComponent, {
        height: '23%',
        width: '25%',
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.chargeCategories();
        }
      });
  }
  showDialogAdd(): void {   
    this.Dialog
      .open(FormCategoryComponent, {
        height: '43%',
        width: '60%',
      })
      .afterClosed()
      .subscribe((addCategory: Boolean) => {
        if (addCategory) {
          this.chargeCategories();
        }
      });
  }
  async deleteCategory(index: any) {

    await this._categoryService.deleteCategory(index).
      subscribe({
        next: (res) => {
          this.chargeCategories();
          this.error(res.message);

        },
        error: (err) => {
          if (err.status == 400 || err.status == 409) {
            this.error(err.error.message);
          }
        }
      });
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }



  async editCategory(index: any) {
    await this.charge(index);
    this.Dialog
      .open(FormCategoryComponent, {
        height: '43%',
        width: '60%',
      }).afterClosed()
      .subscribe((saveCategory: Boolean) => {
        if (saveCategory) {
          this.chargeCategories();
        }
      });
  }
  async charge(index: any) {
    const c = await this._categoryService.getCategoryOne(index);
    this.category = new Category(c.data);
  }
  error(error: string) {
    this._snackBar.open(error, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
