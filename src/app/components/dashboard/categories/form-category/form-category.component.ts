import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';


@Component({
  selector: 'app-crear-usuario',
  templateUrl: './form-category.component.html',
  styleUrls: ['./form-category.component.css']
})
export class FormCategoryComponent implements OnInit, OnDestroy {
  id = 0;
  editar = false;
  form: FormGroup;
  category: Category;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialogo: MatDialogRef<FormCategoryComponent>,

  ) {
    this.category = new Category(this._categoryService.onCategoryChanged.getValue());
    this._unsubscribeAll = new Subject();
    if (this.category.name !== undefined) { 
      this.editar = true;
    }
    this.form = this.fb.group({
      name: [this.category.name ? this.category.name : '', Validators.compose([Validators.required])],
      description: [this.category.description ? this.category.description : '', Validators.compose([Validators.required])],
    });
  }
  ngOnDestroy() {
    this.editar = false;
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this._categoryService.onCategoryChanged.next(null);
  }
  cerrarDialogo(): void {
    this.dialogo.close(false);
  }

  ngOnInit(): void {    
  }
  
  saveCategory(): void {
    const data = this.form.getRawValue();
    this._categoryService.saveCategory({
      "description": data.description,
      "name": data.name,
    }, this.category.id).pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res) => {
          if (res.message != "") {
            this.success(res.message);
          } else {
            this.success('Category updated successfully');
            this.dialogo.close(true);
          }
        },
        error: (err) => {
          this.snackBarMessage(err.messagge)
          this.form.markAllAsTouched();
        }
      });
  }
  addCategory(): void {
    const data = this.form.getRawValue();
    this._categoryService.addCategory({
      "description": data.description,
      "name": data.name,
    }).pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res) => {
          if (res.message != "") {
            this.success(res.message);
          } else {
            this.success('Category created successfully');
            this.dialogo.close(true);
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
      this.router.navigate(['/categories']);
    }
      , 100);
    this.snackBarMessage(message);
  }
  snackBarMessage(message: string) {
    this._snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
