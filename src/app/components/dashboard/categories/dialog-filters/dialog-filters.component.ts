import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filters-categories',
  templateUrl: './dialog-filters.component.html',
  styleUrls: ['./dialog-filters.component.css']
})
export class DialogFiltersComponent implements OnInit {
  selectedOption: string;
  filters: any;
  form: FormGroup;
  constructor(
    public dialog: MatDialogRef<DialogFiltersComponent>,
    private fb: FormBuilder) {
    this.selectedOption = '';
    this.filters = ['True', 'False', 'None'];
    this.form = this.fb.group({    
      filters: ['']
    });
  }

  closeDialog(): void {
    localStorage.removeItem('IsActiveCategory');
    this.dialog.close(false);
  }
  confirm(): void {
    const data = this.form.getRawValue();
    localStorage.setItem('IsActiveCategory', data.filters);
    this.dialog.close(true);
  }

  ngOnInit() {
  }

}