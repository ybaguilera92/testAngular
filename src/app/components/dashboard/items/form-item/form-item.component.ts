import { ActivatedRoute, Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { Observable, startWith, map, Subject, takeUntil, firstValueFrom } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/models/item';


@Component({
  selector: 'app-crear-usuario',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.css']
})
export class FormItemComponent implements OnInit, OnDestroy {
  id = 0;
  editar = false;
  form: FormGroup;
  item: Item;
  categories = new FormControl<string | Category>('');
  options: any[] = [];
  filteredOptions: Observable<Category[]>;
  categoriesList: any[] = [];
  s = {
    "pageNo": 0,
    "pageSize": 10000,
    "filters": null
  };
  categoryId: any;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private fb: FormBuilder,
    private _itemService: ItemService,
    private _categoryService: CategoryService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialogo: MatDialogRef<FormItemComponent>,

  ) {

    this.item = new Item(this._itemService.onItemChanged.getValue());
    this._unsubscribeAll = new Subject();
    if (this.item.name !== undefined) {
      this.editar = true;
    }
    this.form = this.fb.group({
      code: [this.item.code ? this.item.code : '', Validators.compose([Validators.required])],
      name: [this.item.name ? this.item.name : '', Validators.compose([Validators.required])],
      description: [this.item.description ? this.item.description : '', Validators.compose([Validators.required])],
      defaultPrice: [this.item.defaultPrice ? this.item.defaultPrice : 0, Validators.compose([Validators.required, Validators.pattern(/^[0-9]+([.][0-9]{1})?$/)])],
      defaultCost: [this.item.defaultCost ? this.item.defaultCost : 0, Validators.compose([Validators.required, Validators.pattern(/^[0-9]+([.][0-9]{1})?$/)])],
      categories: this.categories,
    });
  }
  ngOnDestroy() {
    this.editar = false;
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  cerrarDialogo(): void {
    this.dialogo.close(false);
  }

  async ngOnInit() {
    await this.chargeCategories();

  }
  async chargeCategories() {
    try {
      const c = await firstValueFrom(this._categoryService.getCategories(this.s));
      this.categoriesList = c.items;
      this.filteredOptions = this.categories.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.categoriesList.slice();
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }
  private _filter(name: string): Category[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name?.toLowerCase().includes(filterValue));
  }
  displayFn(org: Category): string {
    return org && org.name ? org.name : '';
  }
  saveItem(): void {

    const data = this.form.getRawValue();
    this._itemService.saveItem({
      "description": data.description,
      "name": data.name,
      "code": data.code,
      "defaultPrice": data.defaultPrice,
      "defaultCost": data.defaultCost,
    }, this.item.id).pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res) => {
          if (res.message != "") {
            this.success(res.message);
          } else {
            this.success('Category updated successfully');
          }
        },
        error: (err) => {
          this.snackBarMessage(err.messagge)
          this.form.markAllAsTouched();
        }
      });
  }
  addItem(): void {
    const data = this.form.getRawValue();
    this.categoryId = this.categories.value;
    this._itemService.addItem({
      "description": data.description,
      "name": data.name,
      "code": data.code,
      "defaultPrice": data.defaultPrice,
      "defaultCost": data.defaultCost,
      "categoryId": this.categoryId.id,
    }).pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res) => {
          if (res.message != "") {
            this.success(res.message);
          } else {
            this.success('Category created successfully');
          }

        },
        error: (err) => {
          this.snackBarMessage(err.messagge)
          this.form.markAllAsTouched();
        }
      });
  }



  success(message: string) {
    setTimeout(() => {
      this.dialogo.close(true);
      this.router.navigate(['/items']);
    }
      , 100);
    this.snackBarMessage(message)
  }
  snackBarMessage(message: string) {
    this._snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
