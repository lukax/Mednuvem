import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SearchPage } from '../pages/search/search';
import { PatientFilePage } from '../pages/patient-file/patient-file';
import { PatientSchedulePage } from '../pages/patient-schedule/patient-schedule';
import { ImportPatientsPage } from '../pages/import-patients/import-patients';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SearchPage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Buscar', component: SearchPage, icon: 'search' },
      //{ title: 'Consultas', component: PatientSchedulePage, icon: 'list' },
      //{ title: 'Nova consulta', component: PatientFilePage, icon: 'time' },
      { title: 'Novo paciente', component: PatientFilePage, icon: 'person-add' },
      { title: 'Importar', component: ImportPatientsPage, icon: 'folder' },

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
