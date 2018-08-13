import { Inject, Component } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { IEditFactory } from "../../../types/edit-factory";
import { IDialogRangePickerOptions } from "@app/dialogs/dialog-range-picker/input.component.types";
import { merge, lowerCase } from "lodash";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FileDatabase } from "@app/providers/file-database";
import { includesIgnoreCase } from "@app/util/includes-ignore-case";
import { of } from 'rxjs';
import { SocketService } from '@app/providers/socket-service/index.provider';
import { IRemoveFactory } from "types";
import { Logger } from "@app/core";

const logger = new Logger("DialogRangePickerComponent");
@Component({
  selector: "app-dialog-range-picker",
  templateUrl: './index.component.html'
})
export class DialogRangePickerComponent {

  private _form: IEditFactory = {
    min: 0, max: 100, limit: 7, key: ""
  };

  form: FormGroup;

  title: string;

  constructor(
    public dialogRef: MatDialogRef<DialogRangePickerComponent>, private fb: FormBuilder, private database: FileDatabase,
    @Inject(MAT_DIALOG_DATA) private data: IDialogRangePickerOptions,
    private snackBar: MatSnackBar, private socketService: SocketService,
  ) {
    this._form.key = data.key;
    this.data = this.data || {} as any;
    this.title = this.data.title;

    delete this.data.title;

    this._form = merge(this._form, this.data);

    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.form = this.fb.group({
      key: [this._form.key, Validators.required, this.isValid.bind(this)],
      oldKey: [this.data.key],
      min: [this._form.min, Validators.required],
      max: [this._form.max, Validators.required],
      limit: new FormControl(this._form.limit, [Validators.required, Validators.min(1), Validators.max(15)])
    });
  }

  isValid = (control: FormControl) => {
    const value = control.value;

    if (lowerCase(this.data.key).trim() === lowerCase(value).trim()) {
      return of(null);
    }

    const itExists = includesIgnoreCase(this.database.getRootKeys(), value);
    return of(itExists ? { itExists } : null);
  }

  remove() {
    const payload: IRemoveFactory = { key: this.data.key };

    this.socketService.emit("remove_factory", payload, (data: IRemoveFactory) => {
      logger.info("remove_factory callback", data);
       // tslint:disable-next-line:triple-equals
      const message = data.result == 1 ? "Removed succesfully" : "Something went wrong";

      this.snackBar.open(message, "Close", { duration: 2000 });
      this.onNoClick();

    });
  }

}
