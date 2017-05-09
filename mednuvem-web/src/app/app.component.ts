import { Component, ViewChild } from '@angular/core';
import {Nav, Platform, MenuController, LoadingController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SearchPage } from '../pages/search/search';
import { TeamPage } from '../pages/team/team';
import { PatientFilePage } from '../pages/patient-file/patient-file';
import { CalendarEventsPage } from '../pages/calendar-events/calendar-events';
import { ImportPatientsPage } from '../pages/import-patients/import-patients';
import { LoginPage } from '../pages/login/login';
import { LoginService } from '../providers/login.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any, icon: string, auth: boolean, popup?: boolean}>;

  constructor(
      public platform: Platform,
      public statusBar: StatusBar,
      public menu: MenuController,
      public splashScreen: SplashScreen,
      public loginService: LoginService,
      public loadingCtrl: LoadingController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Buscar', component: SearchPage, icon: 'search', auth: true },
      { title: 'Agenda', component: CalendarEventsPage, icon: 'calendar', auth: true },
      //{ title: 'Nova consulta', component: PatientFilePage, icon: 'time', auth: true },
      { title: 'Novo paciente', component: PatientFilePage, icon: 'person-add', auth: true, popup: true },
      { title: 'Importar', component: ImportPatientsPage, icon: 'folder', auth: true, popup: true },
      { title: 'Equipe', component: TeamPage, icon: 'people', auth: true },

      { title: 'Login', component: LoginPage, icon: 'log-in', auth: false },
    ];

  }

  initializeApp() {
    let wait = this.loadingCtrl.create({});
    wait.present();
    this.loginService.isLoggedIn().then(
      (ok) => {
        if(ok) {
          this.rootPage = CalendarEventsPage;
        }
        console.log("[AUTH] ", this.loginService.getUser());
      })
      .catch(() => {})
      .then(() => { wait.dismiss(); });

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
    if(page.popup){
      this.nav.push(page.component);
    } else {
      this.nav.setRoot(page.component);
    }
  }

  openLogin() {
    this.menu.close().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }

  logout() {
      this.loginService.logout();
  }

  isLoggedIn() {
    return this.loginService.getUser() != null;
  }

}
