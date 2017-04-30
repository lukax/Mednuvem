import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {LoadingController, ActionSheetController, NavController, AlertController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Team} from '../../providers/patient';
import {TeamService} from '../../providers/team.service';

@Component({
  templateUrl: 'team.html'
})
export class TeamPage implements OnInit {
  teams: Team[];
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
              private teamSvc: TeamService,
              private alertCtrl: AlertController) {


  }

  ngOnInit() {
    this.search();
  }

  search($infinteScrollEvent?: any): void {
    if($infinteScrollEvent){
      this.pageNumber++;
    } else {
      this.pageNumber = 1;
    }
    this.isLoading = true;
    this.teamSvc.search(this.searchText, this.pageNumber, this.pageSize)
      .subscribe((data) => {
        this.isLoading = false;
        this.isError = false;
        let result = data.result;
        if($infinteScrollEvent){
          if(result.length > 0){
            this.te.push(...result);
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

  isEmptyPatients() {
    return this.patients != null && this.patients.length == 0;
  }


  addMember() {
    let prompt = this.alertCtrl.create({
      title: 'Adicionar membro da equipe',
      inputs: [
        {
          name: 'description',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => { }
        },
        {
          text: 'Adicionar',
          handler: data => {
            if(data){

            }
          }
        }
      ]
    });
    prompt.present();
  }


}

