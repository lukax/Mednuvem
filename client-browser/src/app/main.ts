import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {UploadService} from './services/upload.service';


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
    this.uploadService.makeFileRequest('http://localhost:5000/api/patients/upload', [], files).subscribe(() => {
      console.log('sent');
    });
  }

  selectPatient() {
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
    return this.http.get('http://localhost:5000/api/patients?search=' + search).map(data => {
      return data.json().result;
    }, err => console.log(err));
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

}
