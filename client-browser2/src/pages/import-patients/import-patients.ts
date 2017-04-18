import {Component, OnInit} from '@angular/core';
import {LoadingController, AlertController, NavController} from 'ionic-angular';
import {UploadService} from '../../providers/upload.service';
import * as Constants from '../../providers/constants';

@Component({
  templateUrl: 'import-patients.html'
})
export class ImportPatientsPage implements OnInit {
  files: any;

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

  onPatientFileChange($event: any) {
    this.files = $event.srcElement.files;
  }

  importPatients() {
    if(!this.files){
      this.alertCtrl.create({title: 'Oops...', message: 'Nenhum arquivo selecionado'}).present();
      return;
    }
    let loading = this.loadingCtrl.create({});
    loading.present();
    this.uploadService.makeFileRequest(Constants.API_URL + '/patients/upload', [], this.files).subscribe(
      (data) => {
        loading.dismiss().then(() => {
          this.alertCtrl.create({title: 'OK', message: 'Registros importados. '}).present();
        });
        console.log('importPatients', data);
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
