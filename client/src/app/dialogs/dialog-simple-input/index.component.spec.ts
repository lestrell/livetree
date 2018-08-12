import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { DialogSimpleInputComponent } from './index.component';


import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { By } from '@angular/platform-browser';

describe('DialogSimpleInputComponent', () => {
  let component: DialogSimpleInputComponent;
  let fixture: ComponentFixture<DialogSimpleInputComponent>;

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
      providers: []
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

  it('should set the value to the input', () => {
    const inputDe = fixture.debugElement.query(By.css('input'));
    const inputEl = inputDe.nativeElement;
    inputEl.value = 'SingleInputValue';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.input).toEqual('Updated Task 1');
  });

});
