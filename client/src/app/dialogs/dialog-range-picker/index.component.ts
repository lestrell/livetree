import { Inject, Component } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-dialog-range-picker",
  templateUrl: './index.component.html'
})
export class DialogRangePickerComponent {

  form = {
    min: 0, max: 100, numberOfNodes: 7, name: ""
  };

  constructor(
    public dialogRef: MatDialogRef<DialogRangePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, name: string }
  ) {
    this.form.name = data.name;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
