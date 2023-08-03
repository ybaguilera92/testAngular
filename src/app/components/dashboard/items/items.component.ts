import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from "@angular/material/dialog";
import { Category } from 'src/app/models/category';
import { DialogFiltersComponent } from './dialog-filters/dialog-filters.component';
import { FormItemComponent } from './form-item/form-item.component';
import { ItemService } from 'src/app/services/item.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
@Component({
  selector: 'app-categories',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnDestroy {
  listCategory: any = [];
  objetoJson: any;
  id = localStorage.getItem('id');
  totalItem: any;
  search = {
    "pageNo": 0,
    "pageSize": 5,
    "filters": null
  };
  next: Boolean;
  before: Boolean;
  displayedColumns: string[] = ['code', 'name', 'description', 'category', 'acciones'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  // Private
  /**
    * Constructor
    */
  constructor(private _itemService: ItemService,
    private _snackBar: MatSnackBar,
    public Dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Category>();
    this.next = false;
    this.before = false;
  }

  ngOnInit(): void {
    this.chargeItems();
  }
  ngOnDestroy(): void {
    localStorage.removeItem('IsActiveCategory');
    localStorage.removeItem('CategoryName');
    localStorage.removeItem('totalItem');
    localStorage.removeItem('pageNoItem');
  }
  async chargeItems() {
    this.search.filters = null;
    if (localStorage.getItem('IsActiveCategory') && localStorage.getItem('IsActiveCategory') != 'None') {
      this.search.filters = [{ "Alias": "IsActive", "Value": `${localStorage.getItem('IsActiveCategory')}` }];
    }
    if (localStorage.getItem('CategoryName') != undefined) {
      if (this.search.filters !== null) {
        this.search.filters.push({ "Alias": "CategoryName", "Value": `${localStorage.getItem('CategoryName')}` });
      } else {
        this.search.filters = [{ "Alias": "CategoryName", "Value": `${localStorage.getItem('CategoryName')}` }]
      }
    }
    try {
      const res = await firstValueFrom(this._itemService.getItems(this.search))
      localStorage.setItem('pageNoItem', res.pageNo);
      localStorage.setItem('totalItem', res.total);
      this.totalItem = res.total;
      this.dataSource.data = res.items;
      this.next = res.total > 5;
    } catch (err) {
      console.log(err);
    }
  }
  async Next() {
    const operator = Number(localStorage.getItem('totalItem')) - 5 * (Number(localStorage.getItem('pageNoItem')) + 1);
    this.search.pageNo = Number(localStorage.getItem('pageNoItem')) + 1
    await this.chargeItems();
    if (!this.before) {
      this.before = true;
    }
    if (operator < 5) {
      this.next = false;
    }
  }
  async Before() {
    this.search.pageNo = Number(localStorage.getItem('pageNoItem')) - 1
    await this.chargeItems();
    if (Number(localStorage.getItem('pageNoItem')) === 0) {
      this.before = false;
    }
    if (!this.next) {
      this.next = true;
    }
  }
  showDialog(index: any): void {
    this.Dialog
      .open(DialogConfirmComponent, {
        data: `Are you sure you want to delete the item?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.deleteItem(index);
        }
      });
  }
  showDialogFilters(): void {
    this.Dialog
      .open(DialogFiltersComponent, {
        height: '35%',
        width: '25%',
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.chargeItems();
        }
      });
  }
  showDialogAdd(): void {
    this.Dialog
      .open(FormItemComponent, {
        height: '50%',
        width: '70%',
      })
      .afterClosed()
      .subscribe((addCategory: Boolean) => {
        if (addCategory) {
          this.chargeItems();
        }
      });
  }
  deleteItem(index: any) {
    this._itemService.deleteItem(index).
      subscribe({
        next: (res) => {
          this.chargeItems();
          this.error(res.message);
        },
        error: (err) => {
          this.error(err.error.message);
        }
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  async editItem(index: any) {
    await this.charge(index);
    this.Dialog
      .open(FormItemComponent, {
        height: '50%',
        width: '60%',
      }).afterClosed()
      .subscribe((saveItem: Boolean) => {
        if (saveItem) {
          this.chargeItems();
        }
      });
  }
  async charge(index: any) {
    await this._itemService.getItemOne(index);   
  }
  error(error: string) {
    this._snackBar.open(error, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
