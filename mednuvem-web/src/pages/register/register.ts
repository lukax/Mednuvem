import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { LoginService } from '../../providers/login.service';

@Component({
  templateUrl: 'register.html',
})
export class RegisterPage {
  user = {};

  constructor(private navCtrl: NavController,
              public loginService: LoginService,
              public alertController: AlertController,
              public loadingController: LoadingController) {

  }

  register(user){
    if (!user) return;
    let loader = this.loadingController.create();
    loader.present();
    this.loginService.register(user)
      .subscribe(
        () => {
          loader.dismiss().then(() => {
            this.navCtrl.pop();
            let alert = this.alertController.create({
              title: 'Registro efetuado com sucesso :)',
              buttons: ['OK']
            });
            alert.present();
          });
        },
        (err) => {
          loader.dismiss().then(() => {
            let alert = this.alertController.create({
              title: 'Oops...',
              subTitle: err,
              buttons: ['OK']
            });
            alert.present();
          });
        });
    }
}
