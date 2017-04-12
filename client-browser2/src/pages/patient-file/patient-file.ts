import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {ToastController, LoadingController, ActionSheetController, NavParams, NavController, AlertController} from 'ionic-angular';
import {API_URL} from '../../providers/server';
import {Patient} from '../../providers/patient.service';

@Component({
  templateUrl: 'patient-file.html'
})
export class PatientFilePage implements OnInit {
  patientId: string;
  patient: Patient = new Patient();
  isLoading: boolean;
  page = 'contact';

  constructor(private navParams: NavParams,
              private navCtrl: NavController,
              private alertCtrl: AlertController,
              private http: Http,
              private toastCtrl: ToastController,
              private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController) {

    this.patientId = this.navParams.get('patientId');

  }

  ngOnInit() {
    this.getPatient(this.patientId);
  }

  getPatient(patientId: string) {
    if (patientId) {
      this.isLoading = true;
      this.http.get(API_URL + '/patients/' + patientId)
        .subscribe(p => {
          this.isLoading = false;
          this.patient = p.json();
        }, err => {
          this.showError(err);
          this.isLoading = false; 
        });
    }
  }

  savePatient() {
    if (this.patient.id == null) {
      let confirm = this.alertCtrl.create({
        title: 'Novo paciente',
        message: 'Inserir novo paciente '+ this.patient.name + '?',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
            }
          },
          {
            text: 'OK',
            handler: () => {
              this.isLoading = true;
              this.http.post(API_URL + '/patients', this.patient)
                .subscribe(p => { 
                  this.navCtrl.push(PatientFilePage, { patientId: p.json() }); 
                }, err => { 
                  this.showError(err); this.isLoading = false; 
                }, () => { 
                  this.isLoading = false; 
                });
            }
          }
        ]
      });
      confirm.present();
    } else {
      let confirm = this.alertCtrl.create({
        title: 'Atualizar paciente',
        message: 'Atualizar informações de '+ this.patient.name + '?',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
            }
          },
          {
            text: 'OK',
            handler: () => {
              this.isLoading = true;
              this.http.put(API_URL + '/patients/' + this.patient.id, this.patient)
                .subscribe((p) => { 
                  
                }, err => { 
                  this.showError(err); this.isLoading = false; 
                }, () => { 
                  this.isLoading = false; 
                });
            }
          }
        ]
      });
      confirm.present();
    }
  }

  removePatient() {
    if (this.patient.id != null) {
      let confirm = this.alertCtrl.create({
        title: 'Remover paciente',
        message: 'Remover informações de '+ this.patient.name + '?',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
            }
          },
          {
            text: 'OK',
            handler: () => {
              this.isLoading = true;
              this.http.delete(API_URL + '/patients/' + this.patient.id)
                .subscribe((p) => { 
                  /* */ 
                }, err => { 
                  this.showError(err); this.isLoading = false; 
                }, () => { 
                  this.isLoading = false; 
                });
            }
          }
        ]
      });
      confirm.present();
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

  showError(res) {
    try {
      this.toastCtrl.create({message: res.json().message || 'Oops... erro desconhecido.' }).present();
    } catch (ex) {
      this.toastCtrl.create({message: 'Oops... erro desconhecido.' }).present();
    }
  }

  isEditable() {
    return this.patient && this.patient.id != null;
  }


}

