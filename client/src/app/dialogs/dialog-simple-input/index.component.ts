import { Inject, Component } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FileDatabase } from '@app/providers/file-database';
import { includes } from 'lodash';
import { includesIgnoreCase } from "@app/util/includes-ignore-case";
// tslint:disable-next-line:max-line-length
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { of } from 'rxjs';

// /** A hero's name can't match the given regular expression */
// export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
//   return (control: AbstractControl): {[key: string]: any} | null => {
//     const forbidden = nameRe.test(control.value);
//     return forbidden ? {'forbiddenName': {value: control.value}} : null;
//   };
// }
// function validateEmailFactory(emailBlackList: EmailBlackList) {
//   return (c: FormControl) => {
//     let EMAIL_REGEXP = ...

//     let isValid = /* check validation with emailBlackList */

//     return isValid ? null : {
//       validateEmail: {
//         valid: false
//       }
//     };
//   };
// }

@Component({
  selector: "app-dialog-simple-input",
  templateUrl: './index.component.html'
})
export class DialogSimpleInputComponent {
  // input = "";

  public form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogSimpleInputComponent>, private database: FileDatabase, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // alreadyExists(control: FormControl): ValidatorFn {
  //   let email = control.value;

  //   if (email && email.indexOf("@") != -1) {
  //     let [_, domain] = email.split("@");
  //     if (domain !== "codecraft.tv") {
  //       return {
  //         emailDomain: {
  //           parsedDomain: domain
  //         }
  //       }
  //     }
  //   }
  //   return null;
  // }

  createForm() {
    this.form = this.fb.group({
      factoryName: ['', Validators.required, this.isValid.bind(this)]
    });
  }

  isValid = (control: FormControl) => {
    const value = control.value;
    const itExists = includesIgnoreCase(this.database.getRootKeys(), value);
    console.log(this.form);
    return of(itExists ? { itExists } : null);
  }
}
