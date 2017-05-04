import {AutoCompleteItem, AutoCompleteItemComponent} from 'ionic2-auto-complete';

@AutoCompleteItem({
  template: `<img class="user-avatar" src="https://www.gravatar.com/avatar/{{data.emailHash}}?s=26&amp;d=mm">
              <span [innerHTML]="data.name | boldprefix:keyword"></span> <span>{{data.taxIdNumber}}</span>`
})
export class PatientSearchbarComponent extends AutoCompleteItemComponent{

}
