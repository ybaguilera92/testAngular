import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, firstValueFrom, map, startWith } from 'rxjs';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-dialog-confirmacion',
  templateUrl: './dialog-filters.component.html',
  styleUrls: ['./dialog-filters.component.css']
})
export class DialogFiltersComponent implements OnInit {
  selectedOption: string;
  filters: any;
  form: FormGroup;
  categories = new FormControl<string | Category>('');
  options: any[] = [];
  filteredOptions: Observable<Category[]>;
  s = {
    "pageNo": 0,
    "pageSize": 10000,
    "filters": null
  };
  category: any;
  categoriesList: any[] = [];
  constructor(
    public dialog: MatDialogRef<DialogFiltersComponent>,
    private fb: FormBuilder,
    private _categoryService: CategoryService) {
    this.selectedOption = '';
    this.filters = ['True', 'False', 'None'];
    this.form = this.fb.group({
      filters: [''],
      categories: this.categories,
    });
  }

  closeDialog(): void {
    localStorage.removeItem('IsActiveCategory');
    this.dialog.close(false);
  }
  confirm(): void {
    const data = this.form.getRawValue();
    this.category = this.categories.value;
    if (data.filters === 'True' || data.filters === 'False') {
      localStorage.setItem('IsActiveCategory', data.filters);
    } else {
      localStorage.removeItem('IsActiveCategory');
    }
    if (this.category) {
      localStorage.setItem('CategoryName', this.category.name);
    } else {
      localStorage.removeItem('CategoryName');
    }
    this.dialog.close(true);
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
}