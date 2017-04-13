import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {ToastController} from 'ionic-angular';
import {UploadService} from '../../providers/upload.service';
import * as Constants from '../../providers/constants';
import {Patient} from '../../providers/patient.service';

@Component({
  templateUrl: 'import-patients.html'
})
export class ImportPatientsPage implements OnInit {
  patients: Patient[];
  pageCount: number;
  pageNumber: number;
  patient: Patient;
  searchPatient: any;
  isLoading: boolean;

  constructor(private http: Http,
              private uploadService: UploadService,
              private toastCtrl: ToastController) {


  }

  ngOnInit() {
    this.uploadService.progressObservable.subscribe(data => {
      console.log('progress ' + data);
    });
  }

  onUploadPatientsSubmit(event: any) {
    console.log('onChange');
    var files = event.srcElement.files;
    console.log(files);
    this.uploadService.makeFileRequest(Constants.API_URL + '/upload', [], files).subscribe(() => {
      console.log('sent');
    });
  }

}
