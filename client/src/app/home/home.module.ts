import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatTreeModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { DialogSimpleInputComponent } from '../dialogs/dialog-simple-input/index.component';
import { DialogRangePickerComponent } from '../dialogs/dialog-range-picker/index.component';
import { SocketService } from '@app/providers/socket-service/index.provider';
import { FileDatabase } from "@app/providers/file-database";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    HomeRoutingModule,
    MatTreeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    HomeComponent,
    DialogSimpleInputComponent,
    DialogRangePickerComponent
  ],
  entryComponents: [
    DialogSimpleInputComponent,
    DialogRangePickerComponent
  ],
  providers: [
    SocketService, FileDatabase
  ]
})
export class HomeModule { }
