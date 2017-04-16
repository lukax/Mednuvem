import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {LoadingController, AlertController} from 'ionic-angular';
import {UploadService} from '../../providers/upload.service';
import * as Constants from '../../providers/constants';
import {Patient} from '../../providers/patient.service';

@Component({
  templateUrl: 'import-patients.html'
})
export class ImportPatientsPage implements OnInit {

  constructor(private http: Http,
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
      () => {
        loading.dismiss();
      },
      (err) => {
        loading.dismiss().then(() => {
          this.alertCtrl.create({message: 'Oops... erro ao fazer upload. ' + (err.message || err.errorMessage || err) }).present();
        });
      });
  }

}
