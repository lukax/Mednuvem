import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MaterialModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NguiDatetimePickerModule} from '@ngui/datetime-picker';
import {NguiAutoCompleteModule} from '@ngui/auto-complete';
import {routing, RootComponent} from './routes';

import {TechsModule} from './techs';

import {MainComponent, DialogResultExampleDialog} from './main';
import {HeaderComponent} from './header';
import {TitleComponent} from './title';
import {FooterComponent} from './footer';

import {UploadService} from './services/upload.service';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TechsModule,
    NguiDatetimePickerModule,
    NguiAutoCompleteModule
  ],
  declarations: [
    RootComponent,
    MainComponent,
    HeaderComponent,
    TitleComponent,
    FooterComponent,
    DialogResultExampleDialog
  ],
  entryComponents: [
    DialogResultExampleDialog
  ],
  providers: [
    UploadService,
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}
