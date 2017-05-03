import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {LoadingController, ActionSheetController, NavController, AlertController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Team, TeamMember} from '../../providers/patient';
import {TeamService} from '../../providers/team.service';

@Component({
  templateUrl: 'team.html'
})
export class TeamPage implements OnInit {
  team: Team = new Team();
  isLoading: boolean = false;
  isError: boolean = false;
  searchText: string = '';

  constructor(private http: Http,
              private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController,
              private teamSvc: TeamService,
              private alertCtrl: AlertController) {


  }

  ngOnInit() {
    this.get();
  }

  get(): void {
    this.isLoading = true;
    this.teamSvc.get()
      .subscribe((data) => {
        this.isLoading = false;
        this.isError = false;
        this.team = data;
      }, (err) => {
        this.isLoading = false;
        this.isError = true;
      });
  }

  isEmpty() {
    return this.team.members == null || this.team.members.length == 0;
  }

  addMember() {
    let prompt = this.alertCtrl.create({
      title: 'Adicionar à equipe',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Nome de usuário do Mednuvem'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => { }
        },
        {
          text: 'Adicionar',
          handler: async (data) => {
            if(data){
              let loading = this.loadingCtrl.create({});
              await loading.present();
              try {
                await this.teamSvc.addMember(data);
                await loading.dismiss();
                this.get();
              } catch (ex) {
                await loading.dismiss();
                this.alertCtrl.create({ message: 'Oops... ação não completada. ' + ex }).present();
              }
            }
          }
        }
      ]
    });
    prompt.present();
  }

  removeMember(member: TeamMember) {
    let prompt = this.alertCtrl.create({ message: `Deseja remover ${member.name} da equipe?`, buttons: [
        {
          text: 'Cancelar',
          handler: data => { }
        },
        {
          text: 'Remover',
          handler: async (data) => {
              let loading = this.loadingCtrl.create({});
              await loading.present();
              try {
                await this.teamSvc.removeMember(this.team.id, member.userId);
                await loading.dismiss();
                this.get();
              } catch(ex) {
                await loading.dismiss();
                this.alertCtrl.create({ message: 'Oops... ação não completada. ' + ex }).present();
              }

          }
        }
      ] });
      prompt.present();
  }

  createTeam() {
    let prompt = this.alertCtrl.create({
      title: 'Criar equipe',
      inputs: [
        {
          name: 'name',
          placeholder: 'Nome da nova equipe'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => { }
        },
        {
          text: 'Criar',
          handler: async (data) => {
            if(data){
              let loading = this.loadingCtrl.create({});
              await loading.present();
              try {
                await this.teamSvc.createTeam(data);
                await loading.dismiss();
                this.get();
              } catch (ex) {
                await loading.dismiss();
                this.alertCtrl.create({ message: 'Oops... ação não completada. ' + ex }).present();
              }
            }
          }
        }
      ]
    });
    prompt.present();

  }
}

