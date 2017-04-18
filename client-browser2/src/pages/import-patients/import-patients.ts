import {Component, OnInit} from '@angular/core';
import {LoadingController, AlertController, NavController} from 'ionic-angular';
import {UploadService} from '../../providers/upload.service';
import * as Constants from '../../providers/constants';

@Component({
  templateUrl: 'import-patients.html'
})
export class ImportPatientsPage implements OnInit {

  constructor(private navCtrl: NavController,
              private uploadService: UploadService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {


  }

  ngOnInit() {
    this.uploadService.progressObservable.subscribe(data => {
      console.log('progress ' + data);
    });
  }

  onUploadPatientsSubmit(event: any) {
    let files = event.srcElement.files;
    let loading = this.loadingCtrl.create({});
    loading.present();
    this.uploadService.makeFileRequest(Constants.API_URL + '/patients/upload', [], files).subscribe(
      (data) => {
        loading.dismiss();
        this.alertCtrl.create({title: 'OK', message: data.count + ' registros importados. '}).present();
      },
      (err) => {
        loading.dismiss().then(() => {
          this.alertCtrl.create({title: 'Oops...', message: 'Erro ao importar registros.' + (err.message || err.errorMessage || err) }).present();
        });
      });
  }

  close() {
    if(this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    }
  }

}
