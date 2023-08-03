import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-confirmacion',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirmComponent implements OnInit {

  constructor(
    public dialog: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }

  closeDialog(): void {
    this.dialog.close(false);
  }
  confirm(): void {
    this.dialog.close(true);
  }

  ngOnInit() {
  }

}