import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {ToastController, LoadingController, ActionSheetController, NavController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {API_URL} from '../../providers/server';
import {Patient} from '../../providers/patient.service';
import {PatientFilePage} from '../patient-file/patient-file';

@Component({
  templateUrl: 'search.html'
})
export class SearchPage implements OnInit {
  patients: Patient[];
  pageCount: number;
  pageNumber: number;
  isLoading: boolean;
  searchPatientsObservable: Observable<void>;

  constructor(private http: Http,
              private toastCtrl: ToastController,
              private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController) {


  }

  ngOnInit() {
    this.searchPatients({ target: { value: '' }});
  }

  searchPatients($event: any): void {
    let val = $event.target.value || '';
    this.http.get(API_URL + '/patients?search=' + val).subscribe(data => {
      this.patients = data.json().result;
    });
  }

  getPatient(patient: Patient) {
    this.navCtrl.push(PatientFilePage, { patientId: patient.id });
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
  }

  patientAutocompleteListFormatter(data: Patient): string {
    let str = data.name;
    if (data.medicalInsurance) { str += ` (${data.medicalInsurance})`; };
    return str;
  }


}

