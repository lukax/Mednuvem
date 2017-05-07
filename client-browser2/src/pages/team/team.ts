import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingController, AlertController} from 'ionic-angular';
import {Team, TeamMember, TeamChatMessage} from '../../providers/patient';
import {TeamService} from '../../providers/team.service';
import {TeamChatService} from "../../providers/team-chat.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  templateUrl: 'team.html'
})
export class TeamPage implements OnInit, OnDestroy {
  team: Team = new Team();
  isLoading: boolean = false;
  isError: boolean = false;
  searchText: string = '';
  teamMessages: TeamChatMessage[] = [];
  teamMessageText: string;
  chatError: string = null;
  teamChatSubscription: Subscription;

  constructor(private loadingCtrl: LoadingController,
              private teamSvc: TeamService,
              private alertCtrl: AlertController,
              public teamChatSvc: TeamChatService) {


  }

  ngOnInit() {
    this.get();
    this.teamChatSubscription = this.teamChatSvc.getChatObservable().subscribe(
      (data) => {
        this.teamMessages.push(data);
        this.chatError = null;
      },
      err => this.chatError = err);
  }

  ngOnDestroy() {
    this.teamChatSubscription.unsubscribe();
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

  sendTeamMessage(){
    if(this.teamMessageText){
      this.teamChatSvc.sendMessage(this.teamMessageText);
      this.teamMessageText = '';
    }
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

