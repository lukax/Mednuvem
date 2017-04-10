import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { MyApp } from './app.component';
import { SearchPage } from '../pages/search/search';
import { PatientFilePage } from '../pages/patient-file/patient-file';
import { PatientSchedulePage } from '../pages/patient-schedule/patient-schedule';
import { ImportPatientsPage } from '../pages/import-patients/import-patients';

import { UploadService } from '../providers/upload.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {NguiDatetimePickerModule} from '@ngui/datetime-picker';
import {NguiAutoCompleteModule} from '@ngui/auto-complete';

@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    PatientFilePage,
    PatientSchedulePage,
    ImportPatientsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    FormsModule,
    NguiAutoCompleteModule,
    NguiDatetimePickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    PatientFilePage,
    PatientSchedulePage,
    ImportPatientsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UploadService
  ]
})
export class AppModule {}
