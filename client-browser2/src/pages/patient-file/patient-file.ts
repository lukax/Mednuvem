import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {ToastController, LoadingController, ActionSheetController, NavParams} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {API_URL} from '../../providers/server';
import {Patient} from '../../providers/patient.service';

@Component({
  templateUrl: 'patient-file.html'
})
export class PatientFilePage implements OnInit {
  patientId: string;
  patient: Patient = new Patient();
  isLoading: boolean;

  constructor(private navParams: NavParams,
              private http: Http,
              private toastCtrl: ToastController,
              private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController) {

    this.patientId = this.navParams.get('patientId');

  }

  ngOnInit() {
    this.getPatient(this.patientId);
  }

  searchPatients(search: any): Observable<Patient> {
    return this.http.get(API_URL + '/patients?search=' + search).map(data => {
      return data.json().result;
    }, err => console.log(err));
  }

  getPatient(patientId: string) {
    if (patientId) {
      this.isLoading = true;
      this.http.get(API_URL + '/patients/' + patientId)
        .subscribe(p => {
          this.isLoading = false;
          this.patient = p.json();
        }, err => {
          this.isLoading = false;
          this.toastCtrl.create({message: err.json().message || 'Oops... erro desconhecido.' }).present();
        });
    }
  }

  savePatient() {
    this.isLoading = true;
    if (this.patient.id == null) {
      this.http.post(API_URL + '/patients', this.patient)
        .subscribe(
            p => { /* */ },
            err => { this.showError(err); this.isLoading = false; },
            () => { this.isLoading = false; });
    } else {
      this.http.put(API_URL + '/patients/' + this.patient.id, this.patient)
        .subscribe(
            p => { /* */ },
            err => { this.showError(err); this.isLoading = false; },
            () => { this.isLoading = false; });
    }
  }

  removePatient() {
    if (this.patient.id != null) {
      this.isLoading = true;
      this.http.delete(API_URL + '/patients/' + this.patient.id)
        .subscribe(
            p => { /* */ },
            err => { this.showError(err); this.isLoading = false; },
            () => { this.isLoading = false; });
    }
  }

  presentPatientOptions() {
    if(this.patient.id == null) return;
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ficha do Paciente - Opções',
      buttons: [
        {
          text: 'Remover Paciente',
          role: 'destructive',
          handler: () => {
            this.removePatient();
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
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

  showError(res) {
    try {
      //let message = res.json();

    } catch (ex) {
      //let message = 'Erro desconhecido';

    }
  }

  isEditable() {
    return this.patient && this.patient.id != null;
  }

}

