import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { DialogRangePickerComponent } from '@app/dialogs/dialog-range-picker/index.component';
import { FormsModule } from '@angular/forms';
import { IDialogRangePickerOptions } from './input.component.types';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

describe('DialogRangePickerComponent', () => {
  let component: DialogRangePickerComponent;
  let fixture: ComponentFixture<DialogRangePickerComponent>;

  const data: IDialogRangePickerOptions = {
    min: 0, max: 100, limit: 7, key: "", title: "Title"
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FlexLayoutModule,
        MaterialModule,
        CoreModule,
        SharedModule,
        FormsModule
      ],
      declarations: [DialogRangePickerComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
