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
  pageSize: number = 25;
  pageNumber: number = 1;
  isLoading: boolean;
  searchPatientsObservable: Observable<void>;
  searchEvent: any;

  constructor(private http: Http,
              private toastCtrl: ToastController,
              private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController) {


  }

  ngOnInit() {
    this.searchPatients({ target: { value: '' }});
  }

  searchPatients($searchEvent: any, $infinteScrollEvent?: any): void {
    this.searchEvent = $searchEvent;
    let search = $searchEvent.target.value || '';
    if($infinteScrollEvent){
      this.pageNumber++;
    } else {
      this.pageNumber = 1;
    }
    this.isLoading = true;
    this.http.get(API_URL +  `/patients?pageNumber=${this.pageNumber}&pageSize=${this.pageSize}&search=${search}`)
      .subscribe((data) => {
        let result = data.json().result;
        if($infinteScrollEvent){
          if(result.length > 0){
            this.patients.push(...result);
          } else {
            this.pageNumber --;
          }
        } else {
          this.patients = result;
        }
      }, (err) => {
        if($infinteScrollEvent){
          this.pageNumber--;
        }
        this.toastCtrl.create({message: 'Oops... erro ao se comunicar com servidor', duration: 5000, showCloseButton: true}).present();
      }, () => {
        this.isLoading = false;
        if($infinteScrollEvent) {
          $infinteScrollEvent.complete();
        }
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

  isEmptyPatients() {
    return this.patients != null && this.patients.length == 0;
  }

  doInfinite(infiniteScroll) {
    this.searchPatients(this.searchEvent, infiniteScroll);
  }
}

