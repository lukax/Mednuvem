import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { SearchPage } from '../pages/search/search';
import { PatientFilePage } from '../pages/patient-file/patient-file';
import { PatientSchedulePage } from '../pages/patient-schedule/patient-schedule';
import { ImportPatientsPage } from '../pages/import-patients/import-patients';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import { LoginService } from '../providers/login.service';
import { PatientService } from '../providers/patient.service';
import { UploadService } from '../providers/upload.service';

import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {MomentModule} from 'angular2-moment';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'ng2-ckeditor';
import { AutoCompleteModule } from 'ionic2-auto-complete';

@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    PatientFilePage,
    PatientSchedulePage,
    ImportPatientsPage,
    LoginPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      monthShortNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ],
      dayShortNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab' ],
      //mode: 'ios'
    }),
    IonicStorageModule.forRoot(),
    FormsModule,
    MomentModule,
    CKEditorModule,
    AutoCompleteModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    PatientFilePage,
    PatientSchedulePage,
    ImportPatientsPage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginService, 
    PatientService,
    UploadService
  ]
})
export class AppModule {}
