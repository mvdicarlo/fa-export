import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import * as $ from 'jquery';

import {
  MatButtonModule,
  MatInputModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatToolbarModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { ExportStepperComponent } from './components/export-stepper/export-stepper.component';
import { FuraffinityLoginComponent } from './components/dialogs/furaffinity-login/furaffinity-login.component';

@NgModule({
  declarations: [
    AppComponent,
    ExportStepperComponent,
    FuraffinityLoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatToolbarModule
  ],
  entryComponents: [
    FuraffinityLoginComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
