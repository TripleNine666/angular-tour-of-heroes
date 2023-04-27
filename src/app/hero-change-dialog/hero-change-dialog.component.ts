import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-hero-change-dialog',
  templateUrl: './hero-change-dialog.component.html',
  styleUrls: ['./hero-change-dialog.component.css'],
})
export class HeroChangeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<HeroChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
