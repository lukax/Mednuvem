import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyApp } from './app.component';
import { SearchPage } from '../pages/search/search';
import { TeamPage } from '../pages/team/team';
import { PatientFilePage, PatientSocialProfileComponent, PatientPhoneNumberComponent, PatientAddressComponent } from '../pages/patient-file/patient-file';
import { CalendarEventsPage, ScheduleOptionsPage } from '../pages/calendar-events/calendar-events';
import { ImportPatientsPage } from '../pages/import-patients/import-patients';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import { LoginService } from '../providers/login.service';
import { PatientService } from '../providers/patient.service';
import { TeamService } from '../providers/team.service';
import { UploadService } from '../providers/upload.service';

import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MomentModule } from 'angular2-moment';
import { CKEditorModule } from 'ng2-ckeditor';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { CalendarModule } from 'angular-calendar';
import { CalendarService } from "../providers/calendar.service";
import { PatientAutoCompleteService } from '../providers/patient-autocomplete.service';
import {PatientSearchbarComponent} from "../pages/patient-searchbar/PatientSearchbar";

@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    PatientFilePage,
    CalendarEventsPage,
    ImportPatientsPage,
    LoginPage,
    RegisterPage,
    PatientPhoneNumberComponent,
    PatientSocialProfileComponent,
    PatientAddressComponent,
    TeamPage,
    ScheduleOptionsPage,
    PatientSearchbarComponent
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
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    AutoCompleteModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    PatientFilePage,
    CalendarEventsPage,
    ImportPatientsPage,
    LoginPage,
    RegisterPage,
    PatientPhoneNumberComponent,
    PatientSocialProfileComponent,
    PatientAddressComponent,
    TeamPage,
    ScheduleOptionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginService,
    PatientService,
    TeamService,
    UploadService,
    CalendarService,
    PatientAutoCompleteService
  ]
})
export class AppModule {}
