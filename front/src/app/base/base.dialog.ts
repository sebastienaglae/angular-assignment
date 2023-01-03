import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from './base.component';

@Component({
  selector: 'dialog-animations-dialog',
  templateUrl: 'base.dialog.html',
})
export class BaseDialog {
  title: string = '';
  content: string | any = '';
  yesNo: boolean = false;
  yes: string = 'Oui';
  isContentArray: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<BaseComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit() {
    this.setup(this.data.title, this.data.content, this.data.yesNo);
    this.isContentArray = Array.isArray(this.content);
  }

  // Fonction qui permet de configurer la boite de dialogue
  private setup(title: string, content: string | any, yesNo: boolean = false) {
    this.title = title;
    this.content = content;
    this.yesNo = yesNo;
    if (!yesNo) this.yes = 'Ok';
  }

  // Fonction qui permet de fermer la boite de dialogue
  onClick(state: string): void {
    this.dialogRef.close(state);
  }
}
