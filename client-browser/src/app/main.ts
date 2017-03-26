import {Component} from '@angular/core';

@Component({
  selector: 'fountain-app',
  template: require('./main.html')
})
export class MainComponent {
  convenios = [
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

}
