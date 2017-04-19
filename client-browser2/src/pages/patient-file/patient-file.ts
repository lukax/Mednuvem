import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ToastController, LoadingController, ActionSheetController, NavParams, NavController, AlertController} from 'ionic-angular';
import * as Constants from '../../providers/constants';
import {Patient, PatientService} from '../../providers/patient.service';

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
              private toastCtrl: ToastController,
              private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController,
              private patientSvc: PatientService) {

    this.patientId = this.navParams.get('patientId');

  }

  ngOnInit() {
    this.getPatient(this.patientId);
  }

  getPatient(patientId: string) {
    if (patientId) {
      this.isLoading = true;
      this.patientSvc.findOne(patientId)
        .subscribe(p => {
          this.isLoading = false;
          this.patient = p;
        }, err => {
          this.showError(err);
          this.isLoading = false; 
        });
    }
  }

  savePatient(form: NgForm) {
    if(form && !form.valid) {
      console.log(form);
      this.alertCtrl.create({title: 'Dados inválidos', subTitle: 'Dados marcados com (*) são necessários.'}).present();
      return;
    }
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
              this.patientSvc.saveOrUpdate(this.patient)
                .subscribe(id => { 
                  this.navCtrl.push(PatientFilePage, { patientId: id }); 
                }, err => { 
                  this.isLoading = false; 
                  this.showError(err);
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
              this.patientSvc.saveOrUpdate(this.patient)
                .subscribe((p) => { 
                  this.isLoading = false; 
                }, err => { 
                  this.isLoading = false; 
                  this.showError(err); 
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
              this.patientSvc.delete(this.patient.id)
                .subscribe((p) => {
                  this.isLoading = false;
                }, err => { 
                  this.isLoading = false;
                  this.showError(err);  
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

  patientAutocompleteListFormatter(data: Patient): string {
    let str = data.name;
    if (data.medicalInsurance) { str += ` (${data.medicalInsurance})`; };
    return str;
  }

  showError(res) {
    try {
      this.toastCtrl.create({message: res.json().message || 'Oops... erro desconhecido.', showCloseButton: true }).present();
    } catch (ex) {
      this.toastCtrl.create({message: 'Oops... erro desconhecido. ' + res, showCloseButton: true }).present();
    }
  }

  isEditable() {
    return this.patient && this.patient.id != null;
  }

  close() {
    if(this.navCtrl.canGoBack()){
      this.navCtrl.pop();
    }
  }

  addMeetingMotivation() {
      let prompt = this.alertCtrl.create({
        title: 'Motivo de consulta',
        inputs: [
          {
            name: 'description',
            placeholder: 'Descrição'
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              console.log('Cancel clicked', data);
            }
          },
          {
            text: 'Adicionar',
            handler: data => {
              console.log('Saved clicked', data);
            }
          }
        ]
      });
      prompt.present();
    }
}

