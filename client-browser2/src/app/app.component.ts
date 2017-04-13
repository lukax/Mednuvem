import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SearchPage } from '../pages/search/search';
import { PatientFilePage } from '../pages/patient-file/patient-file';
//import { PatientSchedulePage } from '../pages/patient-schedule/patient-schedule';
import { ImportPatientsPage } from '../pages/import-patients/import-patients';
import { LoginPage } from '../pages/login/login';
import { LoginService } from '../providers/login.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any, icon: string, auth: boolean}>;

  constructor(
      public platform: Platform, 
      public statusBar: StatusBar, 
      public menu: MenuController,
      public splashScreen: SplashScreen,
      public loginService: LoginService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Buscar', component: SearchPage, icon: 'search', auth: true },
      //{ title: 'Consultas', component: PatientSchedulePage, icon: 'list', auth: true },
      //{ title: 'Nova consulta', component: PatientFilePage, icon: 'time', auth: true },
      { title: 'Novo paciente', component: PatientFilePage, icon: 'person-add', auth: true },
      { title: 'Importar', component: ImportPatientsPage, icon: 'folder', auth: true },

      { title: 'Login', component: LoginPage, icon: 'log-in', auth: false },
    ];

  }

  initializeApp() {
    this.loginService.isLoggedIn().then(
      (ok) => {
        if(ok) {
          this.rootPage = SearchPage;
        } else {
        }
        console.log("[AUTH] ", this.loginService.getUser());
      });
    this.loginService.userLoadedEvent.subscribe((obj) => {
      if(obj == null){
        this.openLogin();
      }
    });
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

  openLogin() {
    this.nav.setRoot(LoginPage);
  }

  logout() {
    this.menu.close().then(() => {
      this.loginService.logout();
    });
  }

  isLoggedIn() {
    return this.loginService.getUser() != null;
  }

}
