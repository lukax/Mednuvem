import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {LoadingController, ActionSheetController, NavController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Patient} from '../../providers/patient';
import {PatientFilePage} from '../patient-file/patient-file';
import {PatientService} from '../../providers/patient.service';

@Component({
  templateUrl: 'search.html'
})
export class SearchPage implements OnInit {
  patients: Patient[];
  pageSize: number = 25;
  pageNumber: number = 1;
  isLoading: boolean = false;
  isError: boolean = false;
  searchPatientsObservable: Observable<void>;
  searchText: string = '';

  constructor(private http: Http,
              private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController,
              private patientSvc: PatientService) {


  }

  ngOnInit() {
    this.searchPatients();
  }

  searchPatients($infinteScrollEvent?: any): void {
    if($infinteScrollEvent){
      this.pageNumber++;
    } else {
      this.pageNumber = 1;
    }
    this.isLoading = true;
    this.patientSvc.search(this.searchText, this.pageNumber, this.pageSize)
      .subscribe((data) => {
        this.isLoading = false;
        this.isError = false;
        let result = data.result;
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
        this.isLoading = false;
        this.isError = true;
        if($infinteScrollEvent){
          this.pageNumber--;
        }
      }, () => {
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
      content: "Aguarde...",
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

}

