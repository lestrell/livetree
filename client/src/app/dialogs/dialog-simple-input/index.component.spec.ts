import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { DialogSimpleInputComponent } from './index.component';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { By } from '@angular/platform-browser';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

describe('DialogSimpleInputComponent', () => {
  let component: DialogSimpleInputComponent;
  let fixture: ComponentFixture<DialogSimpleInputComponent>;

  const data = {
    title: "Test Title"
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
      declarations: [DialogSimpleInputComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSimpleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should the expected title', () => {
    // Arrange
    const inputDe = fixture.debugElement.query(By.css('input'));
    const inputEl = inputDe.nativeElement;
    const placeholder = inputEl.getAttribute("placeholder");

     // Assert
    expect(placeholder).toEqual(data.title);

  });

  it('should set the value to the input', () => {
    // Arrange
    const inputDe = fixture.debugElement.query(By.css('input'));
    const inputEl = inputDe.nativeElement;
    inputEl.value = 'SingleInputValue';

    // Act
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(component.input).toEqual('SingleInputValue');
  });

});
