import { Inject, Component } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
	selector: "app-dialog-simple-input",
	templateUrl: './index.component.html'
})
export class DialogSimpleInputComponent {
	input = "";

	constructor(
		public dialogRef: MatDialogRef<DialogSimpleInputComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { title: string }
	) {}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
