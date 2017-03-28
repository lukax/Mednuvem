import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {UploadService} from './services/upload.service';

@Component({
  selector: 'fountain-app',
  template: require('./main.html')
})
export class MainComponent {
  medicalInsurances = [
    {name: 'Particular', value: 'particular'},
    {name: 'Unimed', value: 'unimed'},
    {name: 'Amil', value: 'amil'},
    {name: 'Golden', value: 'golden'},
    {name: 'Bradesco', value: 'bradesco'},
    {name: 'Ipalerj', value: 'ipalerj'},
    {name: 'Dix', value: 'dix'},
    {name: 'Miller', value: 'miller'},
    {name: 'Marítima', value: 'maritma'},
  ];
  patients: {name: string, address: string, email: string, phoneNumber: string, medicalInsurance: string, birthDate: Date, lastAppointment: Date, accountablePerson: string}[];
  pageCount: number;
  pageNumber: number;
  patient: any = {};
  searchPatient: string = null;

  constructor(private http: Http,
              private uploadService: UploadService) {

    this.getPacients();
    this.uploadService.progressObservable.subscribe(data => {
      console.log('progress ' + data);
    });
  }

  getPacients() {
    this.http.get('http://localhost:5000/api/patients').subscribe(data => {
      let json = data.json();
      this.patients = json.result;
      this.pageCount = json.pageCount;
      this.pageNumber = json.pageNumber;
    }, err => console.log(err));
  }

  onUploadPatientsSubmit(event: any) {
    console.log('onChange');
    var files = event.srcElement.files;
    console.log(files);
    this.uploadService.makeFileRequest('http://localhost:5000/api/patients/upload', [], files).subscribe(() => {
      console.log('sent');
    });
  }

  selectPatient(){
    if(this.searchPatient){
      this.patient = this.patients.filter(x => x.name == this.searchPatient)[0] || {};
      this.searchPatient = null;
    }
  }

}
