import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { QuoteService } from './quote.service';
import { MatTreeModule } from '@angular/material';
import { FormsModule } from "@angular/forms";

import { DialogSimpleInputComponent } from '../dialogs/dialog-simple-input/index.component';

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
	FormsModule
  ],
  declarations: [
	HomeComponent,
	DialogSimpleInputComponent
  ],
  entryComponents: [
	DialogSimpleInputComponent
  ],
  providers: [
    QuoteService
  ]
})
export class HomeModule { }
