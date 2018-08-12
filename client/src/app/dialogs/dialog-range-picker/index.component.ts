import { Inject, Component } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { IEditFactory } from "../../../../../types/edit-factory";

@Component({
  selector: "app-dialog-range-picker",
  templateUrl: './index.component.html'
})
export class DialogRangePickerComponent {

  form: IEditFactory = {
    min: 0, max: 100, limit: 7, key: ""
  };

  constructor(
    public dialogRef: MatDialogRef<DialogRangePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, key: string }
  ) {
    this.form.key = data.key;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
