import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {UploadService} from './services/upload.service';
import {API_URL} from './services/server';

@Component({
  selector: 'fountain-app',
  template: require('./main.html')
})
export class MainComponent implements OnInit {
  patients: Patient[];
  pageCount: number;
  pageNumber: number;
  patient: Patient;
  searchPatient: any;
  isLoading: boolean;

  constructor(private http: Http,
              private uploadService: UploadService,
              private _sanitizer: DomSanitizer) {


  }

  ngOnInit() {
    this.patient = new Patient();
    this.searchPatient = null;
    this.uploadService.progressObservable.subscribe(data => {
      console.log('progress ' + data);
    });
  }

  onUploadPatientsSubmit(event: any) {
    console.log('onChange');
    var files = event.srcElement.files;
    console.log(files);
    this.uploadService.makeFileRequest(API_URL + '/upload', [], files).subscribe(() => {
      console.log('sent');
    });
  }

  selectPatient($event: any) {
    console.log(this.searchPatient);
    if (this.searchPatient instanceof Object) {
      this.patient = this.searchPatient;
      this.searchPatient = null;
    } else {
      this.getPatients(this.searchPatient).subscribe(p => this.patient = (p || this.patient));
      this.searchPatient = null;
    }
  }

  patientAutocompleteListFormatter(data: Patient): string {
    let str = data.name;
    if (data.medicalInsurance) { str += ` (${data.medicalInsurance})`; };
    return str;
  }


  getPatients(search: any): Observable<Patient> {
    return this.http.get(API_URL + '/patients?search=' + search).map(data => {
      return data.json().result;
    }, err => console.log(err));
  }

  savePatient() {
    this.isLoading = true;
    if (this.patient.id == null) {
      this.http.post(API_URL + '/patients', this.patient).subscribe(p => console.log(p), err => console.log(err), () => this.isLoading = false);
    } else {
      this.http.put(API_URL + '/patients/' + this.patient.id, this.patient).subscribe(p => console.log(p), err => console.log(err), () => this.isLoading = false);
    }
  }

}


export class Patient {
  id: string;
  name: string;
  taxIdNumber: string;
  address: string;
  email: string;
  phoneNumber: string;
  medicalInsurance: string;
  birthDate: Date;
  lastAppointment: Date;
  accountablePerson: string;
  observations: string;
  medicalReceipt: string;
}
